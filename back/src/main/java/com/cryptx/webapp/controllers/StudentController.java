package com.cryptx.webapp.controllers;

import com.cryptx.webapp.models.Lesson;
import com.cryptx.webapp.models.LessonRequest;
import com.cryptx.webapp.models.Student;
import com.cryptx.webapp.models.StudentRequest;
import com.cryptx.webapp.services.studentService.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;


@RestController
@CrossOrigin("*")
public class StudentController {
    private StudentService studentService;

    @Autowired
    public void setStudentService(StudentService studentService) {
        this.studentService = studentService;
    }


    @PostMapping(path = "/createStudent")
    public void createStudent(@RequestBody StudentRequest request) {
        System.out.println("shevqmnat studenti");
        studentService.saveStudent(request);
    }


    @GetMapping(path = "/getStudentById/{id}")
    public Student getStudentById(@PathVariable Integer id) {
        return studentService.getStudentById(id);
    }


    @GetMapping(path = "/getAllStudents")
    public Iterable<Student> getAllStudents() {
        System.out.println("get all studentebiii");
        return studentService.getAllStudents();
    }


    @DeleteMapping(path = "/deleteStudentById/{id}")
    public void deleteStudentById(@PathVariable Integer id) {
        studentService.deleteStudentById(id);
    }


    @PutMapping(path = "/updateStudentInfo/{id}")
    public void updateStudentInfo(@PathVariable Integer id,
                                  @RequestParam String name,
                                  @RequestParam String surname,
                                  @RequestParam String email,
                                  @RequestParam String personalCodeNumber,
                                  @RequestParam String telNumber,
                                  @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date birthDate) {
        System.out.println("davaaupdatot aba");

        studentService.updateStudentInfo(name, surname, email, personalCodeNumber, telNumber, birthDate, id);
    }

    @PutMapping(path = "/addLesson/{studentId}")
    public void addLessonToStudent(@PathVariable Integer studentId,
                                   @RequestBody LessonRequest lessonRequest) {
        System.out.println(lessonRequest.getSubject());
        studentService.addLessonToStudent(lessonRequest, studentId);
    }


    @GetMapping(path = "/getStudentLessonsList/{id}")
    public Iterable<Lesson> getAllLessonsForStudent(@PathVariable Integer id) {
        return studentService.getAllLessons(id);
    }


}
