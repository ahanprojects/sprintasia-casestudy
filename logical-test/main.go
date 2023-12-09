/*
Sprint Asia University
- Grade range 0 to 100
- Grade < 40 is failure
- Rounding rules
  - if (next multiple of 5) - grade < 3, round to next multiple of 5
  - if grade < 38, no rounding

- Examples:
  - 84 -> 85
  - 29 -> do not round because < 40
  - 57 -> do not round because 60 - 57 >= 3

- Input format:
n
grade[0]
grade[1]
...
grade[n]
*/
package main

import "fmt"

func gradingStudents(grades []int) ([]int) {
	var roundedGrades []int

	for _, grade := range grades {
		ceil := grade + 5 - (grade % 5)
		if (ceil - grade < 3 && grade >= 38) {
			roundedGrades = append(roundedGrades, ceil)
		} else {
			roundedGrades = append(roundedGrades, grade)
		}
	}

	return roundedGrades
}

func main() {
	// Get Inputs
	var n int
	fmt.Println("Enter the number of students:")
	_, err := fmt.Scan(&n)
	if err != nil {
		fmt.Println("Error reading input:", err)
		return
	}

	if !(1 <= n && n <= 60) {
		fmt.Println("Number of students must be between 1 and 60")
		return
	}

	grades := make([]int, n)
	fmt.Println("Enter the grades of each student:")
	for i := 0; i < n; i++ {
		_, err := fmt.Scan(&grades[i])
		if err != nil {
			fmt.Println("Error reading input:", err)
			return
		}
		if !(0 <= grades[i] && grades[i] <= 100) {
			fmt.Println("Grade must be between 0 and 100")
			return
		}
	}

	fmt.Println(gradingStudents(grades))
}

// Execute with command: "go run main.go" from the "logical-test" folder