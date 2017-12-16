import kepler
import json
import math
import sys
import pymysql
import datetime
from numpy import deg2rad

from matplotlib import pyplot as plt

TWO_PI = 2 * math.pi
EARTH_MU = 398600.44
EARTH_R  = 6378.137
EARTH_J2 = 0.00108263

class TZ(datetime.tzinfo):
	def utcoffset(self, dt): return datetime.timedelta(minutes=0)
	def dst(self, dt): return None

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

	if (0.95 < object1.ecc and object1.ecc < 1.05) or (0.95 < object2.ecc and object2.ecc < 1.05) or (object1.isElliptic != object2.isElliptic):
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

	if approximateNumber(object1.ecc, object2.ecc, proportion) < 0:
		print(object1.epoch, object2.epoch, epoch, proportion)
		print(approximateNumber(object1.ecc, object2.ecc, proportion))
		print(object1)
		print(object2)

	return kepler.Orbit(
		approximateNumber(object1.ecc, object2.ecc, proportion),
		approximateNumber(object1.sma, object2.sma, proportion),
		approximateAngle(object1.aop, object2.aop, proportion),
		approximateAngle(object1.inc, object2.inc, proportion),
		approximateAngle(
			object1.loan + object1.getNodalPrecessionByEpoch(EARTH_R, EARTH_J2, epoch),
			object2.loan + object2.getNodalPrecessionByEpoch(EARTH_R, EARTH_J2, epoch),
			proportion
		),
		ma,
		epoch,
		approximateNumber(object1.mu, object2.mu, proportion),
		False
	);

def approximateState(object1, object2, epoch):
	return approximateOrbit(object1, object2, epoch).getStateByEpoch(epoch)

def getActualState(orbits, epoch, startFromIdx):
	for i in range(startFromIdx, len(orbits) - 1):
		if orbits[i].epoch <= epoch and epoch < orbits[i + 1].epoch:
			return approximateOrbit(orbits[i], orbits[i + 1], epoch).getStateByEpoch(epoch)

	if len(orbits) == 1 or epoch < orbits[0].epoch:
		return orbits[0].getStateByEpoch(epoch)

	if epoch >= orbits[len(orbits) - 1].epoch:
		return orbits[len(orbits) - 1].getStateByEpoch(epoch)

def getObjectTrajectory(orbits, maxError, renderingConfig = None):
	trajectory = [(
		orbits[0].ecc,
		orbits[0].sma * (1 - orbits[0].ecc),
		orbits[0].aop,
		orbits[0].inc,
		orbits[0].loan,
		orbits[0].m0,
		orbits[0].epoch,
	)]

	lastAddedIdx = 0
	lastAdded = orbits[0]
	epochsToCheck = []
	lastIdx = len(orbits) - 1

	for i in range(1, lastIdx):
		toAdd = False

		for epoch in epochsToCheck:
			approximatedState = approximateState(lastAdded, orbits[i + 1], epoch)
			actualState = getActualState(orbits, epoch, lastAddedIdx)
			error = approximatedState.position.sub(actualState.position).mag
			if error > maxError:
				toAdd = True

		epoch = (lastAdded.epoch + orbits[i + 1].epoch) / 2
		approximatedState = approximateState(lastAdded, orbits[i + 1], epoch)
		actualState = getActualState(orbits, epoch, lastAddedIdx)
		error = approximatedState.position.sub(actualState.position).mag
		if error > maxError:
			toAdd = True

		if toAdd:
			trajectory.append((
				orbits[i].ecc,
				orbits[i].sma * (1 - orbits[i].ecc),
				orbits[i].aop,
				orbits[i].inc,
				orbits[i].loan,
				orbits[i].m0,
				orbits[i].epoch,
			))
			epochsToCheck = []
			lastAdded = orbits[i]
			lastAddedIdx = i
		else:
			epochsToCheck.append((orbits[i].epoch + orbits[i + 1].epoch) / 2)

	trajectory.append((
		orbits[lastIdx].ecc,
		orbits[lastIdx].sma * (1 - orbits[lastIdx].ecc),
		orbits[lastIdx].aop,
		orbits[lastIdx].inc,
		orbits[lastIdx].loan,
		orbits[lastIdx].m0,
		orbits[lastIdx].epoch,
	))

	result = {
		'type': 'keplerian_precessing_array',
		'periodStart': orbits[0].epoch,
		'periodEnd': orbits[lastIdx].epoch + 86400 * 10,
		'data': {
			'referenceFrame': 39902000,
			'mu': EARTH_MU,
			'j2': EARTH_J2,
			'radius': EARTH_R,
			'elementsArray': trajectory
		}
	}

	if renderingConfig:
		result['rendering'] = renderingConfig

	return result

def dumpJson(fileName, data):
	with open(fileName, 'w') as file:
		file.write(json.dumps(data))

def createSpacecraftFile(fileName, noradId, name, color):
	orbits = getOrbits(noradId)

	renderingConfig = {
		'keplerianModel': True,
		'color': color
	}

	print('Before:', len(orbits))

	traj = getObjectTrajectory(orbits, 20, renderingConfig)

	print('After:', len(traj['data']['elementsArray']))

	dumpJson(fileName, {
		'id': -100000 - noradId,
		'name': name,
		'trajectory': traj
	})

def createOrbit(tle):
	date = datetime.datetime(tle['epoch_year'], 1, 1, 0, 0, 0, 0, tzinfo=TZ()) + datetime.timedelta(tle['epoch_time'] - 1)
	epoch = (date - datetime.datetime(2000, 1, 1, 12, 0, 0, 0, tzinfo=TZ())).total_seconds()

	meanMotion = tle['mean_motion'] / 86400

	sma = (EARTH_MU / (2 * math.pi * meanMotion) ** 2) ** (1/3)

	return kepler.Orbit(
		tle['ecc'],
		sma,
		deg2rad(tle['aop']),
		deg2rad(tle['inc']),
		deg2rad(tle['raan']),
		deg2rad(tle['ma']),
		epoch,
		EARTH_MU,
		False
	)

def getOrbits(noradId):
	connection = pymysql.connect(host='localhost', user='root', password='', db='satcat', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor) 
	cursor = connection.cursor()
	cursor.execute("SELECT `epoch_year`,`epoch_time`,`inc`,`raan`,`ecc`,`aop`,`ma`,`mean_motion` FROM `tle` WHERE `sat_num` = " + str(noradId) + " ORDER BY `epoch_year`,`epoch_time`")
	return [createOrbit(row) for row in cursor.fetchall()]

createSpacecraftFile('./../dist/spacecraft/ISS.json', 25544, 'ISS', 'green')
createSpacecraftFile('./../dist/spacecraft/hubble.json', 20580, 'Hubble Telescope', 'yellow')
