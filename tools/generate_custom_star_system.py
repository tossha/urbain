import json
import math
from numpy import deg2rad
import re

# Format:
#  0 ID
#  1 Parent
#  2 Name
#  3 sma
#  4 ecc
#  5 inc
#  6 aop
#  7 loan
#  8 ma
#  9 Radius
# 10 mu (GM)
# 11 rotation period
# 12 SOI
# 13 Color

TWO_PI = 2 * math.pi

with open('KSP.txt') as file:
	contents = file.read()

	matches = re.findall('(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)\n(.+)', contents)

	objectsData = [{
		'id': '10',
		'type': 1,
		'name': 'Kerbol',
		'trajectory': {
			'type': 'static',
			'data': {
				'referenceFrame': 1000,
				'position': [0,0,0]
			}
		},
		'data': {
			'patchedConics': {
				'soiRadius': 1e12,
				'parentSoiId': 0,
				'childSois': []
			}
		},
		'physical': {
			'radius': 261600,
			'mu': 1172332800
		},
		'orientation': {
			'type': 'constantAxis',
			'config': {'vector': [0,0,1.4544410433286e-5]}
		},
		'visual': {
			'model': 'light',
			'config': {
				'radius': 261600,
				'color': 'yellow'
			}
		}
	}]
	for match in matches:
		parent = int(match[1])
		mu = False
		for obj in objectsData:
			if int(obj['id']) == parent:
				mu = obj['physical']['mu']
		if mu == False:
			print('Parent', match[1], 'not found for body', match[0])
			print('Please rearrange the bodies so that parents come before children')
			exit()

		objectsData.append({
			'id': match[0].strip(),
			'type': 2 if parent == 10 else 4,
			'name': match[2].strip(),
			'trajectory': {
				'type': 'keplerian',
				'visual': {
					'color': match[13].strip().lower(),
					'keplerianModel': True
				},
				'data': {
					'referenceFrame': parent * 100000 + 1000,
					'elements': [
						float(match[4]), # ecc
						float(match[3]) / 1000 * (1 - float(match[4])), # r per
						deg2rad(float(match[6])), # aop
						deg2rad(float(match[5])), # inc
						deg2rad(float(match[7])), # loan
						float(match[8]), # ma
						0,
						mu
					]
				}
			},
			'data': {
				'patchedConics': {
					'soiRadius': float(match[12]) / 1000,
					'parentSoiId': parent,
					'childSois': []
				}
			},
			'physical': {
				'radius': float(match[9]) / 1000,
				'mu': float(match[10])
			},
			'orientation': {
				'type': 'constantAxis',
				'config': {'vector': [0, 0, 2 * math.pi / float(match[11])]}
			},
			'visual': {
				'model': 'basic',
				'config': {
					'radius': float(match[9]) / 1000,
					'color': match[13].strip().lower(),
					'texturePath': 'ksp/' + match[2].strip() + '_biome.png'
				}
			}
		})


file = open('./../public/star_systems/ksp.json', 'w')
file.write(json.dumps({
	'id': 2,
	'name': 'KSP System',
	'directory': 'ksp_system',
	'mainObject': 3,
	'referenceFrames': [],
	'objects': objectsData,
	'stars': []
}))
file.close()
