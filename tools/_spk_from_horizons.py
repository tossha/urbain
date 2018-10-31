from astroquery.jplhorizons import HorizonsClass as Horizons
import math
import spice
import os

spice.loadKernel('kernels/de430.bsp')
spice.loadKernel('kernels/mar097.bsp')
spice.loadKernel('kernels/jup310.bsp')
spice.loadKernel('kernels/sat375.bsp')
spice.loadKernel('kernels/ura111.bsp')
spice.loadKernel('kernels/nep081.bsp')
spice.loadKernel('kernels/plu055.bsp')

def getData(id, parent, etFrom, etTo):
	print('\t\tLoading...')
	try:
		obj = Horizons(id=str(id), id_type='majorbody', location='@' + str(parent), epochs={'start':"'" + spice.et2utc(etFrom) + "'", 'stop':"'" + spice.et2utc(etTo) + "'", 'step':'44000'})
		el = obj.vectors(refplane='earth')
	except:
		print('\t\tError!')
		print('\t\t' + obj.uri)
		exit()

	# print('\t\tGetting the last one...')
	# try:
	# 	obj = Horizons(id=str(id), id_type='majorbody', location='@' + str(parent), epochs=spice.et2jd(etTo))
	# 	last = list(obj.vectors(refplane='earth')[0])
	# 	print(etTo)
	# 	print(spice.et2jd(etTo))
	# 	print(list(el[-1]))
	# 	print(last)
	# 	exit()
	# except:
	# 	print('\t\tError!')
	# 	print('\t\t' + obj.uri)
	# 	exit()

	print('\t\tProcessing...')
	epochs = []
	states = []
	for line in el:
		vals = list(line)
		epochs.append(spice.getET(vals[2]))
		states.append(vals[3:9])

	# if spice.getET(last[2]) > epochs[-1]:
	# 	epochs.append(spice.getET(last[2]))
	# 	states.append(last[3:9])

	return {
		'epochs': epochs,
		'states': states
	}

def makeSpk(scId, name, parents):
	segments = []

	total = len(parents)
	i = 1
	for parent in parents:
		print('\tLoading part', i, 'of', total)
		data = getData(scId, parent['id'], parent['bounds'][0], parent['bounds'][1])
		segments.append({
			'body': scId,
			'center': parent['id'],
			'rf': 'J2000',
			'states': data['states'],
			'epochs': data['epochs'],
		})
		i += 1

	print('\tWriting data...')
	spkName = name + '.bsp'
	spice.writeSpk(spkName, segments)
	return spkName

def makeSunSpk(scId, name, bounds):
	print('Getting sun data...')
	return makeSpk(scId, name + '__sun', [{'id': 10, 'bounds': bounds}])

def makePlanetSpk(scId, name, bounds, approaches):
	parents = []
	for app in approaches:
		for w in app[1]:
			parents.append({'id': app[0], 'bounds': (w.begin, w.end)})

	if len(parents) == 0:
		return False

	print(len(parents), 'approaches found,', end=' ')

	parents = sorted(parents, key=lambda k: k['bounds'][0])
	cur = bounds[0]
	l = len(parents)
	for i in range(l):
		if (cur < parents[i]['bounds'][0]):
			parents.append({'id': 10, 'bounds': (cur, parents[i]['bounds'][0])})
		cur = parents[i]['bounds'][1]

	if (cur < bounds[1]):
		parents.append({'id': 10, 'bounds': (cur, bounds[1])})

	parents = sorted(parents, key=lambda k: k['bounds'][0])

	print('loading', len(parents), 'intervals...')

	return makeSpk(scId, name + '__planets', parents)

def makeSatelliteSpk(scId, name, bounds, planetApproaches, bodies):
	
	return False

	segments = []
	for planetApproach in planetApproaches:
		for planetWindow in planetApproach[1]:
			satApproaches = findApproaches(scId, getSatellites(bodies, planetApproach[0]), (planetWindow.begin, planetWindow.end))
			for satApproach in satApproaches:
				for satWindow in satApproaches[1]:
					segments.append({'id': satApproach[0], 'bounds': (satWindow.begin, satWindow.end)})

	if len(segments) == 0:
		return False

	print(len(segments), 'approaches found,', end=' ')

	segments = sorted(segments, key=lambda k: k['bounds'][0])
	cur = bounds[0]
	l = len(segments)
	for i in range(l):
		if (cur < segments[i]['bounds'][0]):
			segments.append({'id': 10, 'bounds': (cur, segments[i]['bounds'][0])})
		cur = segments[i]['bounds'][1]

	if (cur < bounds[1]):
		segments.append({'id': 10, 'bounds': (cur, bounds[1])})

	segments = sorted(segments, key=lambda k: k['bounds'][0])

	print('loading', len(segments), 'intervals...')

	return makeSpk(scId, name + '__satellites', segments)

def getTimeBounds(id):
	print('Getting time bounds...')
	obj = Horizons(id=str(id), id_type='majorbody', location='@10', epochs=1000000)
	raw = obj.vectors(get_raw_response=True)
	idx = raw.find('prior to A.D.')
	t1 = raw[idx+14:idx+39]
	obj = Horizons(id=str(id), id_type='majorbody', location='@10', epochs=5000000)
	raw = obj.vectors(get_raw_response=True)
	idx = raw.find('after A.D.')
	t2 = raw[idx+11:idx+36]
	return [spice.str2et(t1) + 0.01, spice.str2et(t2) - 0.01]

def getSoiRadius(bodyId):
	if (bodyId > 100) and (bodyId < 1000) and (bodyId % 100 == 99):
		parentId = 10
	elif (bodyId > 100) and (bodyId < 1000):
		parentId = math.floor(bodyId / 100) * 100 + 99
	else:
		print('Unknown bodyId ' + str(bodyId))
		return 0

	try:
		spice.getMu(bodyId)
	except:
		return 0

	elts = spice.getElements(bodyId, parentId, 0)
	sma = elts[0] / (1 - elts[1])
	return sma * (spice.getMu(bodyId) / spice.getMu(parentId)) ** (2/5)
	# return 0.9431 * sma * (spice.getMu(bodyId) / spice.getMu(10)) ** (2/5)

def getLoadedBodyList():
	res = []
	for id in range(100, 1000):
		try:
			spice.getState(id, 10, 0)
			res.append(id)
		except:
			pass
	return res

def getApproachTimes(scId, bodyId, interval):
	soi = getSoiRadius(bodyId)
	if soi == 0:
		return []

	if bodyId % 100 == 99:
		step = 7200
	else:
		step = 600

	print('\tLooking for close approaches near', bodyId, 'at distance of', soi, 'on interval of', round((interval[1] - interval[0]) / 86400), 'days...')

	expectedEvents = 2 * round((interval[1] - interval[0]) / step)
	searchWindow = spice.Window(interval[0], interval[1]).toSpice()
	container = spice.Window.getSpiceContainer(expectedEvents)
	spice.gfdist(
		target = str(scId),       # I   Name of the target body. 
		abcorr = 'NONE',          # I   Aberration correction flag. 
		obsrvr = str(bodyId),     # I   Name of the observing body. 
		relate = '<',             # I   Relational operator. 
		refval = soi,             # I   Reference value. 
		adjust = 0,               # I   Adjustment value for absolute extrema searches. 
		step   = step,            # I   Step size used for locating extrema and roots. 
		nintvls= expectedEvents,  # I   Workspace window interval count. 
		cnfine = searchWindow,    # I-O SPICE window to which the search is confined.
		result = container
	)
	return spice.Window.arrayFromSpice(container)

def findApproaches(scId, bodyList, interval):
	res = []
	for bodyId in bodyList:
		approaches = getApproachTimes(scId, bodyId, interval)
		print('\t\t', len(approaches), 'found')
		if len(approaches) > 0:
			res.append((bodyId, approaches))
	return res

def getMajorBodies(bodies):
	return [id for id in bodies if id % 100 == 99]

def getSatellites(bodies, planet):
	return [id for id in bodies if math.floor(id / 100) == (planet - 99) / 100]

maxEpoch = 3155716867 # 2099-DEC-31 23:59:57.8161 UTC
maxEpoch = 1577880069 # 2050 JAN 01

scId = -96
name = 'parker'

scId = -143205
name = 'roadster'

scId = -37
name = 'hayabusa2'

finalFileName = name + '.bsp'
bodies = getLoadedBodyList()
bounds = getTimeBounds(scId)

print('Time bounds are', spice.et2utc(bounds[0]), spice.et2utc(bounds[1]))

if bounds[1] > maxEpoch:
	bounds[1] = maxEpoch
	print('New time bounds are', spice.et2utc(bounds[0]), spice.et2utc(bounds[1]))

spkName1 = makeSunSpk(scId, name, bounds)

spice.loadKernel(spkName1)

print('Looking for approaches...')
approaches = findApproaches(scId, getMajorBodies(bodies), bounds)

spkName2 = makePlanetSpk(scId, name, bounds, approaches)

if spkName2 == False:
	print('Making final file', finalFileName)
	os.rename(spkName1, finalFileName)
	print('Done.')
	exit()

spice.unload(spkName1)
os.remove(spkName1)
spice.loadKernel(spkName2)

spkName3 = makeSatelliteSpk(scId, name, bounds, approaches, bodies)

spice.unload(spkName2)

print('Making final file', finalFileName)

if spkName3 == False:
	os.rename(spkName2, finalFileName)
else:
	os.remove(spkName2)
	os.rename(spkName3, finalFileName)

print('Done.')
