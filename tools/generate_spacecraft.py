import spice
import kepler
import json
import math
import sys

from matplotlib import pyplot as plt

# spice.loadKernel('kernels/de430.bsp')
spice.loadKernel('naif0012.tls')
spice.loadKernel('pck00010.tpc')
spice.loadKernel('gm_de431.tpc')

# spice.loadKernel('kernels/spacecraft/voyager/voyager_1.ST+1991_a54418u.merged.bsp')

# spice.loadKernel('kernels/spacecraft/voyager/voyager_2.ST+1992_m05208u.merged.bsp')

spice.loadKernel('kernels/spacecraft/lro/lrorg_2009169_2010001_v01.bsp')
spice.loadKernel('kernels/spacecraft/lro/lroevnt_2009173_2009180_v01.bes')
spice.loadKernel('kernels/spacecraft/lro/de421.bsp')

TWO_PI = 2 * math.pi

def approximateAngle(ang1, ang2, proportion):
	ang1 = ((ang1 % TWO_PI) + TWO_PI) % TWO_PI
	ang2 = ((ang2 % TWO_PI) + TWO_PI) % TWO_PI

	diff = ang2 - ang1;

	if abs(diff) > math.pi:
		diff = (diff - TWO_PI) if (diff > 0) else (diff + TWO_PI)

	return ((ang1 + diff * proportion) + TWO_PI) % TWO_PI

def approximateNumber(n1, n2, proportion):
	return n1 + (n2 - n1) * proportion

def approximateOrbit(object1, object2, epoch):
	if object2.epoch == object1.epoch:
		proportion = 0
	else:
		proportion = (epoch - object1.epoch) / (object2.epoch - object1.epoch)

	if (0.95 < object1.ecc and object1.ecc < 1.05) or (0.95 < object2.ecc and object2.ecc < 1.05) or object1.isElliptic != object2.isElliptic:
		state1 = object1.getStateByEpoch(epoch)
		state2 = object2.getStateByEpoch(epoch)
		return kepler.createOrbitByState(
			kepler.StateVector(
				kepler.Vector3(
					approximateNumber(state1.position.x, state2.position.x, proportion),
					approximateNumber(state1.position.y, state2.position.y, proportion),
					approximateNumber(state1.position.z, state2.position.z, proportion)
				),
				kepler.Vector3(
					approximateNumber(state1.velocity.x, state2.velocity.x, proportion),
					approximateNumber(state1.velocity.y, state2.velocity.y, proportion),
					approximateNumber(state1.velocity.z, state2.velocity.z, proportion)
				)
			),
			object2.mu,
			epoch
		)

	if object1.isElliptic:
		ma = approximateAngle(object1.getMeanAnomalyByEpoch(epoch), object2.getMeanAnomalyByEpoch(epoch), proportion)
	else:
		ma = approximateNumber(object1.getMeanAnomalyByEpoch(epoch), object2.getMeanAnomalyByEpoch(epoch), proportion)

	if approximateNumber(object1.sma, object2.sma, proportion) < 0 and approximateNumber(object1.ecc, object2.ecc, proportion) < 1:
		print(object1)
		print(object2)

	return kepler.Orbit(
		approximateNumber(object1.ecc, object2.ecc, proportion),
		approximateNumber(object1.sma, object2.sma, proportion),
		approximateAngle(object1.aop, object2.aop, proportion),
		approximateAngle(object1.inc, object2.inc, proportion),
		approximateAngle(object1.loan, object2.loan, proportion),
		ma,
		epoch,
		approximateNumber(object1.mu, object2.mu, proportion),
		False
	);

def getStateFromSpice(parent, body, epoch):
	global linearPoints
	state = list(spice.spkezr(body, epoch, 'ECLIPJ2000', 'NONE', parent)[0])
	velocity = kepler.Vector3(state[3], state[4], state[5])

	for record in linearPoints:
		if epoch > record[0][0] and epoch < record[0][1]:
			i = 1
			while i < len(record[1][0]):
				if epoch < record[1][0][i]:
					break
				i += 1
			state1 = record[1][1][i-1]
			state2 = record[1][1][i]
			ratio = (epoch - record[1][0][i-1]) / (record[1][0][i] - record[1][0][i-1])

			velocity = state1.velocity.mul(1 - ratio).add(state2.velocity.mul(ratio))
			break

	if epoch == 299024951.06256104:
		print(kepler.StateVector(
			kepler.Vector3(state[0], state[1], state[2]),
			velocity
		))

	return kepler.StateVector(
		kepler.Vector3(state[0], state[1], state[2]),
		velocity
	)

def getOrbitFromSpice(parent, body, epoch, parentMu):
	return kepler.createOrbitByState(
		getStateFromSpice(parent, body, epoch),
		parentMu,
		epoch
	)

def getNextElements(parent, body, currentElements, step, maxError, maxEpoch):
	direction = False
	prevElements = False
	i = 0

	# print(' ')
	while True:
		i += 1
		if currentElements.epoch + step > maxEpoch:
			nextEpoch = maxEpoch
		else:
			nextEpoch = currentElements.epoch + step

		nextElements = getOrbitFromSpice(parent, body, nextEpoch, currentElements.mu)

		approximatedEpoch = (currentElements.epoch + nextEpoch) / 2
		approximatedElements = approximateOrbit(currentElements, nextElements, approximatedEpoch)

		approximatedState = approximatedElements.getStateByEpoch(approximatedEpoch)
		realState = getStateFromSpice(parent, body, approximatedEpoch)

		error = realState.position.sub(approximatedState.position).mag
		errorVel = realState.velocity.sub(approximatedState.velocity).mag

		# print(' ')
		# print(currentElements)
		# print(approximatedElements)
		# print(nextElements)
		# print(parent, body, nextEpoch, currentElements.mu)
		# print('\t', currentElements.epoch, approximatedEpoch, nextEpoch)
		# print('\t', realState.velocity.mag)
		# print('\t\t', approximatedState.velocity.mag)
		# print('\t\t', approximatedElements.ecc)
		# print(nextEpoch - currentElements.epoch, error, errorVel)

		# if step < 1:
		# 	print(getOrbitFromSpice(parent, body, approximatedEpoch, currentElements.mu))

		if error < maxError and errorVel / realState.velocity.mag < 0.002:
			if direction == -1 or (nextEpoch == maxEpoch):
				# print(' breaking')
				break
			else:
				# print(' step x 2')
				direction = 1
				step *= 2
		else:
			if direction == 1:
				# print(' breaking with prev')
				nextElements = prevElements
				break
			else:
				# print(' spep / 2')
				direction = -1
				step = (nextEpoch - currentElements.epoch) / 2

		if i > 10:
			break

		prevElements = nextElements

	return nextElements

def findLinearPoints(body, parent, etFrom, etTo):
	et = etFrom - 1000
	prevVelMag = False
	prevdVelMag = False
	step = 1

	x = []
	y = []
	while et < etTo+500:
		state = getStateFromSpice(parent, body, et)

		# x.append(et)
		# y.append(state.velocity.mag)
		if prevVelMag != False:
			if prevdVelMag != False:
				x.append(et - step)
				y.append(state.velocity.mag - prevVelMag - prevdVelMag)
			prevdVelMag = state.velocity.mag - prevVelMag

		prevVelMag = state.velocity.mag
		et += step

	dSumm = 0
	dSamples = 0
	spikes = {}
	for i in range(len(y)-2):
		if dSamples > 0 and (y[i+1] - y[i]) * (y[i+2] - y[i+1]) < 0 and (abs(y[i+1] - y[i]) > dSumm / dSamples * 2 or abs(y[i+2] - y[i+1]) > dSumm / dSamples * 2):
			et = int(x[i+1])
			if not et-1 in spikes and not et+1 in spikes:
				spikes[et] = abs(y[i+1])
		dSumm += abs(y[i+1] - y[i])
		dSamples += 1

	return list(sorted(spikes, key=spikes.get, reverse=True)[0:4])

def getManeuverTimes():
	query = 'SELECT EVT_TIME, DESCRIPTION FROM LRO_EVENTS WHERE DESCRIPTION LIKE "*DELTAV*" ORDER BY EVT_TIME'

	resultsCnt = spice.ekfind(query, 1000000)[0]
	results = []

	for i in range(resultsCnt - 1):
		row = (spice.ekgd(0, i, 0)[0], spice.ekgc(1, i, 0, 1000)[0])
		if 'to DELTAV' in row[1]:
			results.append((row[0], spice.ekgd(0, i+1, 0)[0]))

	return results

def handleManeuvers(body, parent):
	global linearPoints
	for maneuver in getManeuverTimes():
		points = findLinearPoints('-85', '301', maneuver[0], maneuver[1])
		points.sort()
		data = ((min(points), max(points)), [points, []])
		data[1][1] = [getStateFromSpice(parent, body, et) for et in data[1][0]]
		linearPoints.append(data)

def getObjectTrajectory(body, parent, etFrom, etTo, maxError, renderingConfig, initialStep):
	parentMu = spice.bodvrd(parent, "GM", 1)[1][0]
	lastOrbit = getOrbitFromSpice(parent, body, etFrom, parentMu)

	trajectory = [(
		lastOrbit.ecc,
		lastOrbit.sma * (1 - lastOrbit.ecc),
		lastOrbit.aop,
		lastOrbit.inc,
		lastOrbit.loan,
		lastOrbit.m0,
		lastOrbit.epoch,
		lastOrbit.mu,
	)]

	step = initialStep
	i = 0

	while True:
		orbit = getNextElements(parent, body, lastOrbit, step, maxError, etTo)

		trajectory.append((
			orbit.ecc, 		# ecc
			orbit.sma * (1 - orbit.ecc), # periapsis radius
			orbit.aop, 		# aop
			orbit.inc, 		# inc
			orbit.loan, 	# raan
			orbit.m0, 		# mean anomaly
			orbit.epoch, 	# epoch
		))

		# print(str((lastOrbit.epoch - etFrom) / (etTo - etFrom) * 100)[0:6] + '%', end='\t')
		# print(orbit.ecc)

		step = orbit.epoch - lastOrbit.epoch

		lastOrbit = orbit

		i += 1

		if step == 0:
			print('Reached zero step, exiting :(')
			exit()

		if lastOrbit.epoch >= etTo:
			break

	print(len(trajectory))

	result = {
		'type': 'keplerian_array',
		'periodStart': etFrom,
		'periodEnd': etTo,
		'data': {
			'referenceFrame': int(parent) * 100000 + 1000,
			'mu': parentMu,
			'elementsArray': trajectory
		}
	}

	if renderingConfig:
		result['rendering'] = renderingConfig

	return result

def createCompositeTrajectory(body, renderingConfig, parts):
	trajArray = []

	for part in parts:
		trajArray.append(
			getObjectTrajectory(
				body,
				part['parent'],
				spice.str2et(part['from'] + ' TDB'),
				spice.str2et(part['to'] + ' TDB'),
				part['error'],
				part['rendering'] if 'rendering' in part else None,
				part['step'] if 'step' in part else 60
			)
		)

	result = {
		'type': 'composite',
		'periodStart': min([t['periodStart'] for t in trajArray]),
		'periodEnd':   max([t['periodEnd']   for t in trajArray]),
		'data': trajArray
	}

	if renderingConfig:
		result['rendering'] = renderingConfig

	return result

def dumpJson(fileName, data):
	with open(fileName, 'w') as file:
		file.write(json.dumps(data))

def createSpacecraftFile(fileName, id, name, renderingConfig, trajectoryParts):
	if id == '-85':
		handleManeuvers(id, '301')

	dumpJson(fileName, {
		'id': id,
		'name': name,
		'trajectory': createCompositeTrajectory(id, renderingConfig, trajectoryParts)
	})

linearPoints = []

voyager1traj = (
	{
		'parent': 	'399',
		'from': 	'1977 SEP 05 13:59:24.383',
		'to':   	'1977 SEP 08 09:08:16.593',
		'error': 	10
	},
	{
		'parent': 	'10',
		'from': 	'1977 SEP 08 09:08:16.593',
		'to':   	'1979 JAN 14 15:51:03.735',
		'error': 	100
	},
	{
		'parent': 	'5',
		'from': 	'1979 JAN 14 15:51:03.735',
		'to':   	'1979 APR 24 07:33:02.637',
		'error': 	10
	},
	{
		'parent': 	'10',
		'from': 	'1979 APR 24 07:33:02.637',
		'to':   	'1980 OCT 06 10:14:10.024',
		'error': 	100
	},
	{
		'parent': 	'6',
		'from': 	'1980 OCT 06 10:14:10.024',
		'to':   	'1980 DEC 20 16:45:19.847',
		'error': 	10
	},
	{
		'parent': 	'10',
		'from': 	'1980 DEC 20 16:45:19.847',
		'to':   	'1982 JAN 01 00:00:00.000',
		'error': 	100
	},
	{
		'parent': 	'10',
		'from': 	'1982 JAN 01 00:00:00.000',
		'to':   	'2021 JAN 01 00:00:00.000',
		'error': 	500
	}
)

voyager2traj = (
	{
		'parent': 	'399',
		'from': 	'1977 AUG 20 15:32:32.183',
		'to':   	'1977 AUG 23 11:29:10.841',
		'error': 	10
	},
	{
		'parent': 	'10',
		'from': 	'1977 AUG 23 11:29:10.841',
		'to':   	'1979 MAY 03 21:42:56.180',
		'error': 	100
	},
	{
		'parent': 	'5',
		'from': 	'1979 MAY 03 21:42:56.180',
		'to':   	'1979 SEP 15 11:07:25.029',
		'error': 	10
	},
	{
		'parent': 	'10',
		'from': 	'1979 SEP 15 11:07:25.029',
		'to':   	'1981 JUL 04 11:59:48.682',
		'error': 	100
	},
	{
		'parent': 	'6',
		'from': 	'1981 JUL 04 11:59:48.682',
		'to':   	'1981 OCT 17 18:43:56.352',
		'error': 	10
	},
	{
		'parent': 	'10',
		'from': 	'1981 OCT 17 18:43:56.352',
		'to':   	'1986 JAN 04 11:58:08.565',
		'error': 	100
	},
	{
		'parent': 	'7',
		'from': 	'1986 JAN 04 11:58:08.565',
		'to':   	'1986 FEB 14 00:01:30.505',
		'error': 	10
	},
	{
		'parent': 	'10',
		'from': 	'1986 FEB 14 00:01:30.505',
		'to':   	'1989 AUG 02 10:57:30.716',
		'error': 	200
	},
	{
		'parent': 	'8',
		'from': 	'1989 AUG 02 10:57:30.716',
		'to':   	'1989 SEP 16 20:56:57.938',
		'error': 	10
	},
	{
		'parent': 	'10',
		'from': 	'1989 SEP 16 20:56:57.938',
		'to':   	'1991 JAN 05 00:00:00.000',
		'error': 	200
	},
	{
		'parent': 	'10',
		'from': 	'1991 JAN 05 00:00:00.000',
		'to':   	'2021 JAN 05 00:00:00.000',
		'error': 	400
	}
)

voyagerRendering = {
	'color': 'green',
	'pointArrayModel': {
	'showAhead': False,
	'showBehind': True,
	'trailPeriod': 86400 * 250,
	'referenceFrame': 1000,
	}
}

lroTraj = (
	{
		'parent': 	'399',
		'from': 	'2009 JUN 18 22:17:06.185',
		'to':   	'2009 JUN 22 21:00:00.000',
		'error': 	30,
		'step':     600,
		'rendering':{
			'color': 'white',
			'pointArrayModel': {
				'showAhead': False,
				'showBehind': True,
				'trailPeriod': 86400 * 3,
				'referenceFrame': 39901000,
			}
		}
	},
	{
		'parent': 	'301',
		'from': 	'2009 JUN 22 21:00:00.000',
		'to':   	'2009 DEC 31 23:01:06.183',
		'error': 	30,
		'step':     600,
		'rendering':{
			'color': 'white',
			'keplerianModel': True
		}
	},
)

lroRendering = {
	'color': 'white',
	'pointArrayModel': {
		'showAhead': False,
		'showBehind': True,
		'trailPeriod': 86400 * 3,
		'referenceFrame': 39901000,
	}
}

# createSpacecraftFile('voyager1.json', '-31', 'Voyager 1', voyagerRendering, voyager1traj)
# createSpacecraftFile('voyager2.json', '-32', 'Voyager 2', voyagerRendering, voyager2traj)

# handleManeuvers('-85', '301')
# print(getOrbitFromSpice('301', '-85', 299024951.06256104, 4902.80006616))
# print(getOrbitFromSpice('301', '-85', 299024951.06256104, spice.bodvrd('301', "GM", 1)[1][0]))

# prevVel = False
# x = []
# y1 = []
# y2 = []
# y3 = []
# et = 299110000
# while et < 299112000:
# 	state1 = getStateFromSpice('301', '-85', et)
# 	state2 = list(spice.spkezr('-85', et, 'ECLIPJ2000', 'NONE', '301')[0])
# 	vel2 = kepler.Vector3(state2[3], state2[4], state2[5]).mag
# 	# if prevVel != False:
# 	x.append(et)
# 		# y3.append(vel2 - prevVel)
# 	prevVel = vel2
# 	y1.append(state1.velocity.mag)
# 	y2.append(vel2)
# 	et += 1

# if len(y1):
# 	plt.plot(x,y1,label='my')
# if len(y2):
# 	plt.plot(x,y2,label='DE')
# if len(y3):
# 	plt.plot(x,y3)

# plt.legend()
# plt.show()
createSpacecraftFile('./../dist/spacecraft/lro.json', '-85', 'LRO', False, lroTraj)
