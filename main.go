package main

//gin web framework
import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type Solution struct{
	Grid [9][12] string
	Time int
	hasFailed bool
}

type items struct {
	Trucks int
	Monitors int
	Pipes int
	Hose1 int
	Hose2 int
	Hose3 int
	Hose4 int
	Hose5 int
	Walls int
	Fires int
	Hydrants int
	WallPositions [10][2] int
	FirePositions [2][2] int
	HydrantPosition [2] int
}


//true means violated
func checkConstraintViolation(input items, constraints items) bool {
	if(input.Trucks != constraints.Trucks || input.Fires != constraints.Fires|| input.Monitors != constraints.Monitors ||  input.Hydrants != constraints.Hydrants || input.Hose1 > constraints.Hose1|| input.Hose2 > constraints.Hose2|| input.Hose3 > constraints.Hose3|| input.Hose4 > constraints.Hose4|| input.Hose5 > constraints.Hose5){
		fmt.Println("failing here3")
		fmt.Println(input)
		fmt.Println(constraints)
		return true
	}
	if(input.FirePositions != constraints.FirePositions || input.WallPositions != constraints.WallPositions || input.HydrantPosition != constraints.HydrantPosition){
		fmt.Println("failing here 4")
		return true
	}

	return false
}

//true means the num of items are correct
func countItems(grid [9][12] string, constraints items) Solution {
	
	var modifiedSolution Solution
	var inputItems items

	col_length := 12
	row_length := 9
	curr := 0


	fireIdx := 0
	wallIdx := 0

	for curr < col_length * row_length {
		row := curr / col_length
		col := curr % col_length
		// fmt.Println(grid[row][col])
		switch grid[row][col]{
		case "🚒":
			inputItems.Trucks += 1
			grid[row][col] = "🚒🚒v"
			if(row + 1 <row_length && grid[row+1][col] =="🚒" ){
				grid[row][col] = "🚒🚒v"
				grid[row+1][col] = "🚒🚒v"
				if(grid[row+2][col] != "🚒"){
					fmt.Println("failing here2")
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row+2][col] = "🚒🚒v"
			}else if(col +1 < col_length && grid[row][col+1] == "🚒"){
				grid[row][col] = "🚒🚒h"
				grid[row][col+1] = "🚒🚒h"
				grid[row][col+2] = "🚒🚒h"
			}else{
				fmt.Println("failing here1")
				modifiedSolution.hasFailed = true
				return modifiedSolution
			}
		case "RB", "LB", "LT", "RT":
			inputItems.Pipes += 1
		case "🚰t","🚰l","🚰r","🚰b":
			inputItems.Monitors += 1
		case "🔥":
			inputItems.Fires += 1
			inputItems.FirePositions[fireIdx][0] = row
			inputItems.FirePositions[fireIdx][1] = col
			fireIdx++
		case "📦":
			inputItems.Walls += 1
			inputItems.WallPositions[wallIdx][0] = row
			inputItems.WallPositions[wallIdx][1] = col
			wallIdx++
		case "🧯":
			inputItems.Hydrants += 1
			inputItems.HydrantPosition[0] = row
			inputItems.HydrantPosition[1] = col
		case "1▮":
			inputItems.Hose1 += 1
		case "2▬":
			inputItems.Hose2 += 1
			grid[row][col] = "2▬▬h"
			for i :=1;i<2;i++ {
				if(grid[row][col+i] != "2▬"){
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row][col+i] = "2▬▬h"
			}
		case "2▮":
			inputItems.Hose2 += 1
			grid[row][col] = "2▮▮v"
			for i :=1;i<2;i++ {
				if(grid[row+i][col] != "2▮"){
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row+i][col] = "2▮▮v"
			}
		case "3▬":
			inputItems.Hose3 += 1
			grid[row][col] = "3▬▬h"
			for i :=1;i<3;i++ {
				if(grid[row][col+i] != "3▬"){
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row][col+i] = "3▬▬h"
			}
			
		case "3▮":
			inputItems.Hose3 += 1
			grid[row][col] = "3▮▮v"
			for i :=1;i<3;i++ {
				if(grid[row+i][col] != "3▮"){
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row+i][col] = "3▮▮v"
			}
		case "4▬":
			inputItems.Hose4 += 1
			grid[row][col] = "4▬▬h"
			for i :=1;i<4;i++ {
				if(grid[row][col+i] != "4▬"){
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row][col+i] = "4▬▬h"
			}
		case "4▮":
			inputItems.Hose4 += 1
			grid[row][col] = "4▮▮v"
			for i :=1;i<4;i++ {
				if(grid[row+i][col] != "4▮"){
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row+i][col] = "4▮▮v"
			}
		case "5▬":
			inputItems.Hose5 += 1
			grid[row][col] = "5▬▬h"
			for i :=1;i<5;i++ {
				if(grid[row][col+i] != "5▬"){
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row][col+i] = "5▬▬h"
			}
		case "5▮":
			inputItems.Hose5 += 1
			grid[row][col] = "5▮▮v"
			for i :=1;i<5;i++ {
				if(grid[row+i][col] != "5▮"){
					modifiedSolution.hasFailed = true
					return modifiedSolution
				}
				grid[row+i][col] = "5▮▮v"
			}
		}
		curr++
	}
	
	modifiedSolution.hasFailed = checkConstraintViolation(inputItems, constraints)
	modifiedSolution.Grid = grid
	return modifiedSolution
}

type checkResult struct {
	direction string
	isFinished bool
	skipStep bool //if enter firetruck and need to jump
	failImmediately bool
	isPipe bool
}

func checkNextMove(grid [9][12]string, seen [9][12] bool, row int, col int, direction string) checkResult {
	var result checkResult
	switch grid[row][col]{
	case "RB":
		if(direction == "T"){
			direction = "R"
		}else if(direction == "L"){
			direction = "B"
		}else{
			result.failImmediately = true
			return result
		}
	case "LB":
		if(direction == "T"){
			direction = "L"
		}else if(direction == "R"){
			direction = "B"
		}else{
			result.failImmediately = true
			return result
		}
	case "RT":
		if(direction == "B"){
			direction = "R"
		}else if(direction == "L"){
			direction = "T"
		}else{
			result.failImmediately = true
			return result
		}
	case "LT":
		if(direction == "R"){
			direction = "T"
		}else if(direction == "B"){
			direction = "L"
		}else{
			result.failImmediately = true
			return result
		}
	}
	
	switch direction{
	case "L":
		col -= 1
	case "R":
		col += 1
	case "T": 
		row -= 1
	case "B":
		row += 1
	}
	if(row >= len(grid) || col >= len(grid[0]) || row < 0 || col < 0 || seen[row][col]){
		result.failImmediately = true
		return result
	}
	// fmt.Println("past this", row, col, grid[row][col], direction)
	fmt.Println("Next step:",direction, row, col, grid[row][col])
	switch direction{
	case "L":
		switch grid[row][col]{
		case "RB":
			// result.direction = "B"
			result.direction = "L"
			result.isPipe = true
		case "RT":
			// result.direction = "T"
			result.direction = "L"
			result.isPipe = true
		case "1▮", "2▬▬h","3▬▬h","4▬▬h","5▬▬h":
			result.direction = "L"
		case "🚒🚒v":
			result.direction = "L"
			result.skipStep = true
		case "🚰l":
			if col-2 >= 0 && !seen[row][col-2] && grid[row][col-2] == "🔥"{
				result.isFinished = true
				return result
			}
		default:
			result.failImmediately = true
			return result
		}
	case "R":
		switch grid[row][col]{
		case "LB":
			// result.direction = "B"
			result.direction = "R"
			result.isPipe = true
		case "LT":
			// result.direction = "T"
			result.direction = "R"
			result.isPipe = true
		case "1▮", "2▬▬h","3▬▬h","4▬▬h","5▬▬h":
			result.direction = "R"
		case "🚒🚒v":
			result.direction = "R"
			result.skipStep = true
		case "🚰r":
			if col+2 < len(grid[0]) && !seen[row][col+2] && grid[row][col+2] == "🔥"{
				result.isFinished = true
				return result
			}
		default:
			result.failImmediately = true
			return result
		}
	case "T": 
		switch grid[row][col]{
		case "RB":
			// result.direction = "R"
			result.direction = "T"
			result.isPipe = true
		case "LB":
			// result.direction = "L"
			result.direction = "T"
			result.isPipe = true
		case "1▮", "2▮▮v","3▮▮v","4▮▮v","5▮▮v":
			result.direction = "T"
		case "🚒🚒h":
			result.direction = "T"
			result.skipStep = true
		case "🚰t":
			if row-2 >= 0 && !seen[row-2][col] && grid[row-2][col] == "🔥"{
				result.isFinished = true
				return result
			}
		default:
			result.failImmediately = true
			return result
		}
	case "B":
		switch grid[row][col]{
		case "RT":
			// result.direction = "R"
			result.direction = "B"
			result.isPipe = true
		case "LT":
			// result.direction = "L"
			result.direction = "B"
			result.isPipe = true
		case "1▮", "2▮▮v","3▮▮v","4▮▮v","5▮▮v":
			result.direction = "B"
		case "🚒🚒h":
			result.direction = "B"
			result.skipStep = true
		case "🚰b":
			if row+2 >= 0 && !seen[row+2][col] && grid[row+2][col] == "🔥"{
				result.isFinished = true
				return result
			}
		default:
			result.failImmediately = true
			return result
		}
	}
	return result
}

func checkIncrement(res checkResult) [2]int{
	steps := [...]int{0,0}
	multiplier := 1
	if(res.skipStep){
		multiplier *=2
	}
	switch res.direction{
	case "L":
		steps[1] -= multiplier
	case "R":
		steps[1] += multiplier
	case "T":
		steps[0] -= multiplier
	case "B":
		steps[0] += multiplier
	}
	return steps
}

func printGrid(grid [9][12]string){
	for index, element := range grid {
		fmt.Println(index, element)
	}
}

func checkSolution(grid [9][12] string, constraints items) bool {
	printGrid(grid)
	var seen [9][12]bool
	var result checkResult
	//make sure to check 2 fires
	for i := 0; i < 2;i++{
		row := constraints.HydrantPosition[0]
		col := constraints.HydrantPosition[1]

		var direction string
		//1st time check left side of hydrant
		if i  == 0{ 
			direction = "L"
		}else{
			direction = "R"
		}

		for{
			// fmt.Println("Curr:", row, col, grid[row][col])
			seen[row][col] = true
			fmt.Println("Dirction:", direction)
			result = checkNextMove(grid, seen, row,col, direction)
			// fmt.Println("Result:",result)
			if(result.failImmediately){
				return false
			}
			if(result.isFinished){
				break
			}
			// if(result.isPipe){
			// 	actualDirection := result.direction
			// 	result.direction = direction
			// 	steps := checkIncrement(result)
			// 	row += steps[0]
			// 	col += steps[1]
			// 	seen[row][col] = true
			// 	result.direction = actualDirection
			// }

			steps := checkIncrement(result)
			row += steps[0]
			col += steps[1]
			direction = result.direction
			fmt.Println("Curr:", row, col, grid[row][col], direction)
		}

	}

	return true
}

func main() {

    r := gin.Default() //creates router object 

    //send back string response to get request
    r.GET("/flag", func(c *gin.Context) {
        c.String(200, "Who in their right mind thought this would work?")
    })

    r.POST("/submit", func(c *gin.Context) {
		var msg struct {
			Result   string 
			Message string
		}
		constraints := items{
			Trucks: 1,
			Monitors: 2,
			Pipes: 12,
			Hose1: 3,
			Hose2: 5,
			Hose3: 2,
			Hose4: 1,
			Hose5: 1,
			Walls: 10,
			Fires: 2,
			Hydrants: 1,
			WallPositions: [10][2]int{
				{0,10},
				{0,11},
				{1,10},
				{2,10},
				{2,11},
				{4,10},
				{4,11},
				{5,10},
				{6,10},
				{6,11},
			},
			FirePositions: [2][2]int{
				{1,11},
				{5,11},
			},
			HydrantPosition: [2]int{6,5},
		}
		var json Solution
		var checkedJson Solution
		if c.BindJSON(&json) == nil {
			fmt.Println("grid:", json.Grid)
			fmt.Printf("time: %d\n", json.Time)

			checkedJson = countItems(json.Grid, constraints)
			if(!checkedJson.hasFailed && checkSolution(checkedJson.Grid, constraints)){
				msg.Result = "Success"
				msg.Message = "Good work! flag{testing_flag}"
			}else{

				msg.Result = "Invalid Solution!"
				msg.Message = "Please try again"
			}

		} else {
			msg.Result = "Input Error"
        	msg.Message = "Check the format of your input"
		}
		

        c.JSON(http.StatusOK, msg)
	})

	//serve static files from view directory
	r.Use(static.Serve("/", static.LocalFile("./views", true)))

    //r.Run(":3000") // for local
    r.Run() 
}