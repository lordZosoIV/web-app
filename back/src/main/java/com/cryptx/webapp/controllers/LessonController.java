package com.cryptx.webapp.controllers;

import com.cryptx.webapp.models.Lesson;
import com.cryptx.webapp.services.lessonService.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.time.LocalTime;


@RestController
@CrossOrigin("*")
public class LessonController {
    private LessonService lessonService;

    @Autowired
    public void setLessonService(LessonService lessonService) {
        this.lessonService = lessonService;
    }


    @GetMapping(path = "/getLessonByLessonId/{id}")
    public Lesson getStudentLessonByLessonId(@PathVariable Integer id) {
        return lessonService.getLessonById(id);
    }


    @DeleteMapping(path = "/deleteLessonById/{id}")
    public void deleteLessonById(@PathVariable Integer id) {
        lessonService.deleteLessonById(id);
    }

    @PutMapping(path = "/updateLessonById/{id}")
    public void updateLessonByid(@PathVariable Integer id,
                                 @RequestParam String subject,
                                 @RequestParam Integer day,
                                 @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime startTime,
                                 @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime endTime) {

        lessonService.updateLesson(day, subject, startTime, endTime, id);
    }

}
