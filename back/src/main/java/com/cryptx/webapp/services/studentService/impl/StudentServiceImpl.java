package com.cryptx.webapp.services.studentService.impl;

import com.cryptx.webapp.models.Lesson;
import com.cryptx.webapp.models.LessonRequest;
import com.cryptx.webapp.models.Student;
import com.cryptx.webapp.models.StudentRequest;
import com.cryptx.webapp.repositories.StudentRepository;
import com.cryptx.webapp.services.mailService.impl.MailServiceImpl;
import com.cryptx.webapp.services.studentService.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component("studentServiceB1")
public class StudentServiceImpl implements StudentService {

    private StudentRepository studentRepository;

    @Autowired
    public void setStudentRepository(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }


    @Override
    public Iterable<Student> getAllStudents() {
        return studentRepository.findAll();
    }


    @Override
    public Student getStudentById(Integer id) {
        return studentRepository.findById(id).orElse(null);
    }


    @Override
    public void saveStudent(StudentRequest studentRequest) {

        Student student = new Student();

        if(studentRequest.getName() == null) return;
        student.setName(studentRequest.getName());

        if(studentRequest.getSurname() == null) return;
        student.setSurname(studentRequest.getSurname());

        if(studentRequest.getEmail() == null) return;
        student.setEmail(studentRequest.getEmail());

        if(studentRequest.getPersonalCodeNumber() == null) return;
        student.setPersonalCodeNumber(studentRequest.getPersonalCodeNumber());

        if(studentRequest.getTelNumber() == null) return;
        student.setTelNumber(studentRequest.getTelNumber());

        if(studentRequest.getBirthDate() == null) return;
        student.setBirthDate(studentRequest.getBirthDate());

        studentRepository.save(student);
        MailServiceImpl.getInstance().sendMail(studentRequest.getEmail(), "You're added in DB");
    }


    public void deleteStudentById(Integer id) {
        Student student = getStudentById(id);
        if (student == null) return;

        MailServiceImpl.getInstance().sendMail(student.getEmail(), "You're deleted in DB");
        studentRepository.deleteById(id);
    }


    @Override
    public void addLessonToStudent(LessonRequest lessonRequest, Integer id) {

        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) return;

        Lesson lesson = new Lesson();
        lesson.setStudent(student);

        lesson.setDay(lessonRequest.getDay());
        lesson.setStartTime(lessonRequest.getStartTime());
        lesson.setEndTime(lessonRequest.getEndTime());
        lesson.setSubject(lessonRequest.getSubject());

        student.addLesson(lesson);

        studentRepository.save(student);
        MailServiceImpl.getInstance().sendMail(student.getEmail(), "added " + lessonRequest.getSubject());
    }


    @Override
    public Iterable<Lesson> getAllLessons(Integer id) {
        Student student = getStudentById(id);
        return student.getAllLessons();
    }

    @Override
    public void updateStudentInfo(String name, String surname, String email, String personalCodeNumber, String telNumber, Date birthDate, Integer id) {

        Student toUpdate = studentRepository.findById(id).orElse(null);

        if (toUpdate == null) return;

        if (name != null) toUpdate.setName(name);
        if (surname != null) toUpdate.setSurname(surname);
        if (email != null) toUpdate.setEmail(email);
        if (personalCodeNumber != null) toUpdate.setPersonalCodeNumber(personalCodeNumber);
        if (telNumber != null) toUpdate.setTelNumber(telNumber);
        if (birthDate != null) toUpdate.setBirthDate(birthDate);

        studentRepository.save(toUpdate);
        MailServiceImpl.getInstance().sendMail(toUpdate.getEmail(), "changed info");
    }


}
