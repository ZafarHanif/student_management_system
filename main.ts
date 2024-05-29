#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

class Course {
  constructor(public name: string, public fee: number) {}
}

class Student {
  private static idCounter = 0;
  public id: string;
  public courses: Course[] = [];
  public balance: number = 0;

  constructor(public firstName: string, public lastName: string) {
    Student.idCounter += 1;
    this.id = this.generateStudentID();
  }

  private generateStudentID(): string {
    return (Student.idCounter + 21000).toString();
  }

  enroll(course: Course): void {
    this.courses.push(course);
    this.balance += course.fee;
  }

  payTuition(amount: number): void {
    this.balance -= amount;
  }

  getStatus(): string {
    return `
      Name: ${this.firstName} ${this.lastName}
      Student ID: ${this.id}
      Courses Enrolled: ${this.courses.map((course) => course.name).join(", ")}
      Balance: PKR ${this.balance.toFixed(2)}
    `;
  }
}

class StudentManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [
    new Course("Typescript", 45000),
    new Course("Javascript", 50000),
    new Course("Python", 75000),
    new Course("HTML", 30000),
    new Course("PHP", 30000),
  ];

  async start(): Promise<void> {
    console.log(
      chalk.rgb(
        255,
        192,
        0
      )("\n\t Welcome to CodeWithZefi - Student Management System\n\t")
    );

    while (true) {
      const { action } = await inquirer.prompt<{ action: string }>({
        name: "action",
        type: "list",
        message: "Choose an action:",
        choices: [
          "Add Student",
          "Enroll Student",
          "View Balance",
          "Pay Tuition",
          "Show Status",
          "Exit",
        ],
      });

      switch (action) {
        case "Add Student":
          await this.addStudent();
          break;
        case "Enroll Student":
          await this.enrollStudent();
          break;
        case "View Balance":
          await this.viewBalance();
          break;
        case "Pay Tuition":
          await this.payTuition();
          break;
        case "Show Status":
          await this.showStatus();
          break;
        case "Exit":
          console.log(chalk.green("Exiting..."));
          return;
      }
    }
  }

  async addStudent(): Promise<void> {
    const { firstName, lastName } = await inquirer.prompt<{
      firstName: string;
      lastName: string;
    }>([
      { name: "firstName", type: "input", message: "First Name:" },
      { name: "lastName", type: "input", message: "Last Name:" },
    ]);
    const student = new Student(firstName, lastName);
    this.students.push(student);
    console.log(
      chalk.rgb(
        255,
        219,
        172
      )(`Student ${firstName} ${lastName} added with ID ${student.id}`)
    );
    console.log(
      chalk.rgb(
        255,
        192,
        0
      )("..................................................")
    );
  }

  async enrollStudent(): Promise<void> {
    const student = await this.selectStudent();
    const { courseName } = await inquirer.prompt<{ courseName: string }>({
      name: "courseName",
      type: "list",
      message: "Select a course to enroll:",
      choices: this.courses.map((course) => course.name),
    });
    const course = this.courses.find((course) => course.name === courseName)!;
    student.enroll(course);
    // console.log(chalk.rgb(141, 85, 36)(`Enrolled ${student.firstName} ${student.lastName} in ${course.name}.`));
    console.log(
      chalk.yellow.bold(
        `Enrolled Successfully! ${student.firstName} ${student.lastName} in ${course.name}.`
      )
    );
    console.log("------------------------------------------------");
  }

  async viewBalance(): Promise<void> {
    const student = await this.selectStudent();
    // console.log(chalk.rgb(71, 162, 245)(`${student.firstName} ${student.lastName} has a balance of PKR ${student.balance.toFixed(2)}.`));
    console.log(
      chalk.red.bold(
        `${student.firstName} ${
          student.lastName
        } has a balance of PKR ${student.balance.toFixed(2)}.`
      )
    );
    console.log("------------------------------------------------");
  }

  async payTuition(): Promise<void> {
    const student = await this.selectStudent();
    const { amount } = await inquirer.prompt<{ amount: string }>({
      name: "amount",
      type: "input",
      message: "Enter payment amount:",
      validate: (input: string) =>
        !isNaN(parseFloat(input)) ? true : "Please enter a valid amount.",
    });
    student.payTuition(parseFloat(amount));
    console.log(
      chalk.rgb(
        71,
        162,
        245
      )(
        `Payment of PKR ${amount} made for ${student.firstName} ${student.lastName}.`
      )
    );
    console.log("------------------------------------------------");
  }

  async showStatus(): Promise<void> {
    const student = await this.selectStudent();
    console.log(chalk.green.bold(student.getStatus()));
  }

  private async selectStudent(): Promise<Student> {
    const { studentID } = await inquirer.prompt<{ studentID: string }>({
      name: "studentID",
      type: "list",
      message: "Select a student:",
      choices: this.students.map((student) => ({
        name: `${student.firstName} ${student.lastName} (${student.id})`,
        value: student.id,
      })),
    });
    return this.students.find((student) => student.id === studentID)!;
  }
}

const sms = new StudentManagementSystem();
sms.start();
