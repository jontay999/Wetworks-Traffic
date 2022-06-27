#!/usr/bin/env python

from flask import Flask, Response, abort, request, render_template, jsonify
from flask_cors import CORS, cross_origin
from string import *
from time import time

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
flag = open("flag.txt").read()

constraints = {
	'trucks': 1,
	'monitors': 2,
	'pipes': 12,
	'hose1': 0,
	'hose2': 0,
	'hose3': 15,
	'hose4': 0,
	'hose5': 0,
	'walls': 16,
	'fires': 2,
	'hydrants': 1,
	'wallPositions': [
		[0, 8],
		[0, 7],
		[0, 9],
		[1, 7],
		[1, 9],
		[2, 7],
		[2, 8],
		[2, 9],
		[4, 8],
		[4, 9],
		[4, 10],
		[5, 8],
		[5, 10],
		[6, 8],
		[6, 9],
		[6, 10],
	],
	'firePositions': [
		[1, 8],
		[5, 9],
	],
	'hydrantPosition': [8, 6]
}
col_length = 12
row_length = 9

# true means violated


def checkConstraintViolation(inputs, constraints):
	if (inputs['trucks'] != constraints['trucks'] or
		inputs["fires"] != constraints["fires"] or
		inputs["monitors"] != constraints["monitors"] or
		inputs["hydrants"] != constraints["hydrants"] or
		inputs["hose1"] > constraints["hose1"] or
		inputs["hose2"] > constraints["hose2"] or
		inputs["hose3"] > constraints["hose3"] or
		inputs["hose4"] > constraints["hose4"] or
		inputs["hose5"] > constraints["hose5"]):
		print("wrong number")
		return True

	if(sorted(inputs["firePositions"]) != sorted(constraints["firePositions"]) or sorted(inputs["wallPositions"]) != sorted(constraints["wallPositions"]) or inputs["hydrantPosition"] != constraints["hydrantPosition"]):
		print(inputs["firePositions"] == constraints["firePositions"])
		print(inputs["wallPositions"])
		print(constraints["wallPositions"])
		print(inputs["hydrantPosition"]==constraints["hydrantPosition"])
		print("failing cos wrong position")
		return True

	return False


def countItems(grid, constraints):

	curr = 0
	fireIdx = 0
	wallIdx = 0

	inputItems = {
		'trucks': 0,
		'monitors': 0,
		'pipes': 0,
		'hose1': 0,
		'hose2': 0,
		'hose3': 0,
		'hose4': 0,
		'hose5': 0,
		'walls': 0,
		'fires': 0,
		'hydrants': 0,
		'wallPositions': [[0,0] for _ in range(len(constraints['wallPositions']))],
		'firePositions': [[0,0] for _  in range(len(constraints['firePositions']))],
		'hydrantPosition': [0,0]
	}

	modifiedSolution = {
		'grid': [],
		'hasFailed': False
	}

	while (curr < col_length * row_length):
		row = curr // col_length
		col = curr % col_length

		elem = grid[row][col]

		if(elem == "🚒"):
			count = inputItems.get('trucks', 0)
			inputItems["trucks"] = count + 1
			grid[row][col] = "🚒🚒v"
			if(row + 1 < row_length and grid[row+1][col] == "🚒"):
				grid[row][col] = "🚒🚒v"
				grid[row+1][col] = "🚒🚒v"
				if(grid[row+2][col] != "🚒"):
					print("failing here at truck")
					modifiedSolution["hasFailed"] = True
					return modifiedSolution

				grid[row+2][col] = "🚒🚒v"

			elif(col + 1 < col_length and grid[row][col+1] == "🚒"):
				grid[row][col] = "🚒🚒h"
				grid[row][col+1] = "🚒🚒h"
				grid[row][col+2] = "🚒🚒h"
			else:
				print("failing here")
				modifiedSolution["hasFailed"] = True
				return modifiedSolution

		elif (elem in ["RB", "LB", "LT", "RT"]):
			count = inputItems.get('pipes', 0)
			inputItems["pipes"] = count + 1
		elif (elem in ["🚰t", "🚰l", "🚰r", "🚰b"]):
			count = inputItems.get('monitors', 0)
			inputItems['monitors'] = count + 1
		elif (elem == "🔥"):
			count = inputItems.get('fires', 0)
			inputItems['fires'] = count + 1
			inputItems['firePositions'][fireIdx][0] = row
			inputItems['firePositions'][fireIdx][1] = col
			fireIdx += 1
		elif(elem == "📦"):
			count = inputItems.get('walls', 0)
			inputItems['walls'] = count + 1
			inputItems["wallPositions"][wallIdx][0] = row
			inputItems["wallPositions"][wallIdx][1] = col
			wallIdx += 1
		elif (elem ==  "🧯"):
			count = inputItems.get('hydrants', 0)
			inputItems['hydrants'] =  count + 1
			inputItems["hydrantPosition"][0] = row
			inputItems["hydrantPosition"][1] = col
		elif (elem ==  "1▮"):
			count = inputItems.get('hose1', 0)
			inputItems['hose1'] = count + 1
		elif (elem == "2▬"):
			count = inputItems.get('hose2', 0)
			iputItems['hose2'] = count + 1
			grid[row][col] = "2▬▬h"
			for i in range(1,2):
				if(grid[row][col+i] != "2▬"):
					modifiedSolution["hasFailed"] = True
					return modifiedSolution
				grid[row][col+i] = "2▬▬h"

		elif (elem ==  "2▮"):
			count = inputItems.get('hose2', 0)
			inputItems['hose2'] = count + 1
			grid[row][col] = "2▮▮v"
			for i in range(1,2):
				if(grid[row+i][col] != "2▮"):
					modifiedSolution["hasFailed"] = True
					return modifiedSolution
				grid[row+i][col] = "2▮▮v"

		elif (elem == "3▬"):
			count = inputItems.get('hose3', 0)
			inputItems['hose3'] =  count + 1
			grid[row][col] = "3▬▬h"
			for i in range(1,3):
				if(grid[row][col+i] != "3▬"):
					modifiedSolution["hasFailed"] = True
					return modifiedSolution
				
				grid[row][col+i] = "3▬▬h"
			
		elif (elem == "3▮"):
			count = inputItems.get('hose3', 0)
			inputItems['hose3'] = count + 1
			grid[row][col] = "3▮▮v"
			for i in range(1,3):
				if(grid[row+i][col] != "3▮"):
					modifiedSolution["hasFailed"] = True
					return modifiedSolution
				grid[row+i][col] = "3▮▮v"

		elif( elem == "4▬"):
			count = inputItems.get('hose4', 0)
			inputItems.Hose4 = count + 1
			grid[row][col] = "4▬▬h"
			for i in range(1,4):
				if(grid[row][col+i] != "4▬"):
					modifiedSolution["hasFailed"] = True
					return modifiedSolution
				grid[row][col+i] = "4▬▬h"

		elif( elem == "4▮"):
			count = inputItems.get('hose4', 0)
			inputItems.Hose4 = count + 1
			grid[row][col] = "4▮▮v"
			for i in range(1,4):
				if(grid[row+i][col] != "4▮"):
					modifiedSolution["hasFailed"] = True
					return modifiedSolution
				grid[row+i][col] = "4▮▮v"
		elif( elem == "5▬"):
			count = inputItems.get('hose5', 0)
			inputItems.Hose5 = count + 1
			grid[row][col] = "5▬▬h"
			for i in range(1,5):
				if(grid[row][col+i] != "5▬"):
					modifiedSolution["hasFailed"] = True
					return modifiedSolution
				grid[row][col+i] = "5▬▬h"
		elif( elem == "5▮"):
			count = inputItems.get('hose5', 0)
			inputItems.Hose5 = count + 1
			grid[row][col] = "5▮▮v"
			for i in range(1,5):
				if(grid[row+i][col] != "5▮"):
					modifiedSolution["hasFailed"] = True
					return modifiedSolution
				grid[row+i][col] = "5▮▮v"
		curr += 1
	modifiedSolution['hasFailed'] = checkConstraintViolation(inputItems, constraints)
	modifiedSolution['grid'] = grid
	return modifiedSolution


def checkNextMove(grid, seen, row, col, direction):
	elem = grid[row][col]

	result = {
		'direction': '',
		'isFinished': False,
		'skipStep': False,
		'failImmediately': False,
		'isPipe': False
	}
	
	if elem == "RB":
		if(direction == "T"):
			direction = "R"
		elif(direction == "L"):
			direction = "B"
		else:
			result["failImmediately"] = True
			return result
		
	elif elem == "LB":
		if(direction == "T"):
			direction = "L"
		elif(direction == "R"):
			direction = "B"
		else:
			result["failImmediately"] = True
			return result
		
	elif elem == "RT":
		if(direction == "B"):
			direction = "R"
		elif(direction == "L"):
			direction = "T"
		else:
			result["failImmediately"] = True
			return result
		
	elif elem == "LT":
		if(direction == "R"):
			direction = "T"
		elif(direction == "B"):
			direction = "L"
		else:
			result["failImmediately"] = True
			return result
		
	
	
	if direction == "L":
		col -= 1
	elif direction == "R":
		col += 1
	elif direction == "T": 
		row -= 1
	elif direction == "B":
		row += 1

	if(row >= len(grid) or col >= len(grid[0]) or row < 0 or col < 0 or seen[row][col]):
		result['failImmediately'] = True
		return result

	elem = grid[row][col]
	if direction == "L":
		if elem == "RB":
			result["direction"] = "L"
			result["isPipe"] = True
		elif elem == "RT":
			result["direction"] = "L"
			result["isPipe"] = True
		elif elem in ["1▮", "2▬▬h","3▬▬h","4▬▬h","5▬▬h"]:
			result["direction"] = "L"
		elif elem == "🚒🚒v":
			result["direction"] = "L"
			result["skipStep"] = True
		elif elem == "🚰l":
			if col-2 >= 0 and not seen[row][col-2] and grid[row][col-2] == "🔥":
				result["isFinished"] = True
				return result
		else:
			result["failImmediately"] = True
			return result
	elif direction == "R":
		if elem == "LB":
			result["direction"] = "R"
			result["isPipe"] = True
		elif elem == "LT":
			result["direction"] = "R"
			result["isPipe"] = True
		elif elem in ["1▮", "2▬▬h","3▬▬h","4▬▬h","5▬▬h"]:
			result["direction"] = "R"
		elif elem == "🚒🚒v":
			result["direction"] = "R"
			result["skipStep"] = True
		elif elem == "🚰r":
			if col+2 < len(grid[0]) and not seen[row][col+2] and grid[row][col+2] == "🔥":
				result["isFinished"] = True
				return result
		else:
			result["failImmediately"] = True
			return result
	elif direction == "T": 
		if elem == "RB":
			result["direction"] = "T"
			result["isPipe"] = True
		elif elem == "LB":
			result["direction"] = "T"
			result["isPipe"] = True
		elif elem in ["1▮", "2▮▮v","3▮▮v","4▮▮v","5▮▮v"]:
			result["direction"] = "T"
		elif elem == "🚒🚒h":
			result["direction"] = "T"
			result["skipStep"] = True
		elif elem == "🚰t":
			if row-2 >= 0 and not seen[row-2][col] and grid[row-2][col] == "🔥":
				result["isFinished"] = True
				return result
		else:
			result["failImmediately"] = True
			return result

	elif direction == "B":
		if elem == "RT":
			result["direction"] = "B"
			result["isPipe"] = True
		elif elem == "LT":
			result["direction"] = "B"
			result["isPipe"] = True
		elif elem in ["1▮", "2▮▮v","3▮▮v","4▮▮v","5▮▮v"]:
			result["direction"] = "B"
		elif elem == "🚒🚒h":
			result["direction"] = "B"
			result["skipStep"] = True
		elif elem == "🚰b":
			if row+2 >= 0 and not seen[row+2][col] and grid[row+2][col] == "🔥":
				result["isFinished"] = True
				return result
		else:
			result["failImmediately"] = True
			return result

	return result




def checkIncrement(res):
	steps = [0,0]
	multiplier = 1
	if(res['skipStep']):
		multiplier *=2
	
	direction = res['direction']

	if direction == "L":
		steps[1] -= multiplier
	elif direction == "R":
		steps[1] += multiplier
	elif direction == "T":
		steps[0] -= multiplier
	elif direction == "B":
		steps[0] += multiplier
	
	return steps



def printGrid(grid):
	for i in grid: 
		print(i)

def checkSolution(grid, constraints):
	printGrid(grid)
	seen = [[False for _ in range(col_length)] for i in range(row_length)]

	result = {
		'direction': '',
		'isFinished': False,
		'skipStep': False,
		'failImmediately': False,
		'isPipe': False
	}

	for i in range(2):
		row = constraints['hydrantPosition'][0]
		col = constraints['hydrantPosition'][1]

		direction = ''
		# 1st time check left side of hydrant
		if i  == 0:
			direction = "L"
		else:
			direction = "R"

		while True:
			seen[row][col] = True
			print("Dirction:", direction)
			result = checkNextMove(grid, seen, row,col, direction)
			if result['failImmediately']:
				return False
			
			if result['isFinished']:
				break
			
			steps = checkIncrement(result)
			row += steps[0]
			col += steps[1]
			direction = result['direction']

	return True



@app.route("/", methods=["GET", "POST"])
@cross_origin()
def index():
	if request.method == "GET":
		# if you want, can encode the start parameters here

		return None
	if request.method == "POST":
		json = request.json
		print('json:', json)
		msg = {}
		if 'grid' in json:
			print('grid:', json['grid'])
			checkedJson = countItems(json["grid"], constraints)
			if not checkedJson['hasFailed'] and checkSolution(json["grid"], constraints):
				msg["result"] = "Success"
				msg["message"] = f"Good work! {flag}"
			else:
				msg["result"] = "Invalid Solution!"
				msg["message"] = "Please try again"

		else:
			msg['result'] = "Input Error"
			msg['message'] = "Check the format of your input"
		

		return jsonify(msg)


if __name__ == "__main__":
	app.run() # port 5000 by default
