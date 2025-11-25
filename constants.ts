import { Level } from './types';

export const INITIAL_LEVELS: Level[] = [
  {
    id: 1,
    title: "System Initialization",
    topic: "Variables & Print",
    description: "Initialize the Neural Link by defining core variables.",
    difficulty: "Novice",
    xpReward: 100,
    locked: false,
    missionObjective: "Create a variable named `status` and assign it the string \"Active\". Then, print the `status`.",
    starterCode: "# Initialize system status\n# Write your code below\n",
    hints: [
      "Use the '=' operator to assign values.",
      "Strings must be wrapped in quotes like \"text\".",
      "Use the print() function to output data."
    ]
  },
  {
    id: 2,
    title: "Data Flux",
    topic: "Basic Arithmetic",
    description: "Calibrate the power output modules.",
    difficulty: "Novice",
    xpReward: 150,
    locked: true,
    missionObjective: "Create a variable `power` with value 50. Multiply it by 2 and assign the result to a new variable `total_output`. Print `total_output`.",
    starterCode: "power = 50\n# Calculate total_output below\n",
    hints: [
      "The multiplication symbol in Python is '*'.",
      "Make sure to define `total_output` before printing it."
    ]
  },
  {
    id: 3,
    title: "Logic Gatekeeper",
    topic: "If/Else Statements",
    description: "Determine if the security breach is critical.",
    difficulty: "Adept",
    xpReward: 200,
    locked: true,
    missionObjective: "Check the `threat_level` variable. If it is greater than 8, print \"Critical Alert\". Otherwise, print \"Stable\".",
    starterCode: "threat_level = 9\n\n# Write your if/else logic here\n",
    hints: [
      "Use 'if condition:' followed by an indented block.",
      "Use 'else:' for the alternative case.",
      "Don't forget the colons ':' at the end of if/else lines."
    ]
  },
  {
    id: 4,
    title: "Loop Construct",
    topic: "For Loops",
    description: "Iterate through the mainframe sectors to repair data.",
    difficulty: "Adept",
    xpReward: 300,
    locked: true,
    missionObjective: "Write a loop that prints \"Repairing Sector X\" for numbers 1 through 5 (inclusive).",
    starterCode: "# Use a range() loop\n",
    hints: [
      "range(start, stop) goes up to, but does not include, the stop number.",
      "You can use an f-string: f\"Repairing Sector {i}\""
    ]
  },
  {
    id: 5,
    title: "Function Protocol",
    topic: "Functions",
    description: "Define a reusable protocol for encrypting messages.",
    difficulty: "Expert",
    xpReward: 500,
    locked: true,
    missionObjective: "Define a function called `encrypt` that takes one parameter `msg`. It should print \"Encrypted: \" followed by the message.",
    starterCode: "# Define your function here\n\n\n# Test your function\nencrypt(\"Secret Data\")",
    hints: [
      "Use 'def function_name(parameter):'",
      "Make sure the print statement inside is indented."
    ]
  }
];