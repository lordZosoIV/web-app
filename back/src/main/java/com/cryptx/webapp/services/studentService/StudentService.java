package com.cryptx.webapp.services.studentService;

import com.cryptx.webapp.models.Lesson;
import com.cryptx.webapp.models.LessonRequest;
import com.cryptx.webapp.models.Student;
import com.cryptx.webapp.models.StudentRequest;

import java.util.Date;

public interface StudentService {

    Iterable<Student> getAllStudents();

    Student getStudentById(Integer id);

    void saveStudent(StudentRequest studentRequest);

    void deleteStudentById(Integer id);

    void addLessonToStudent(LessonRequest lessonRequest, Integer id);

    Iterable<Lesson> getAllLessons(Integer id);

    void updateStudentInfo(String name, String surname, String email, String personalCodeNumber, String telNumber, Date birthDate, Integer id);
}
