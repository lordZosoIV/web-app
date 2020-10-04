package com.cryptx.webapp.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class StudentRequest {
    private int studentId;

    private String name;

    private String surname;

    private String email;

    private String personalCodeNumber;

    private String telNumber;

    private Date birthDate;

    private List<Lesson> lessons = new ArrayList<>();



    public StudentRequest(String name, String surname, String email, String personalCodeNumber, String telNumber, Date birthDate) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.personalCodeNumber = personalCodeNumber;
        this.telNumber = telNumber;
        this.birthDate = birthDate;
    }

    public void addLesson(Lesson lesson){
        lessons.add(lesson);
    }

    public Iterable<Lesson> getAllLessons(){
        return lessons;
    }




    public int getId() {
        return studentId;
    }

    public void setId(int id) {
        this.studentId = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPersonalCodeNumber() {
        return personalCodeNumber;
    }

    public void setPersonalCodeNumber(String personalCodeNumber) {
        this.personalCodeNumber = personalCodeNumber;
    }

    public String getTelNumber() {
        return telNumber;
    }

    public void setTelNumber(String telNumber) {
        this.telNumber = telNumber;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }
}
