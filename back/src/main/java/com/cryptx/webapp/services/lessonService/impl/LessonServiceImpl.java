package com.cryptx.webapp.services.lessonService.impl;

import com.cryptx.webapp.models.Lesson;
import com.cryptx.webapp.repositories.LessonRepository;
import com.cryptx.webapp.services.lessonService.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component("studentServiceB2")
public class LessonServiceImpl implements LessonService {
    private LessonRepository lessonRepository;

    @Autowired
    public void setLessonRepository(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }



    @Override
    public Lesson getLessonById(Integer id) {
        return lessonRepository.findById(id).orElse(null);
    }

    @Override
    public void updateLesson(Integer day, String subject, LocalTime startTime, LocalTime endTime, Integer id) {

        Lesson lessonInDB = lessonRepository.findById(id).orElse(null);

        if(lessonInDB == null) return;

        lessonInDB.setDay(day);
        lessonInDB.setSubject(subject);
        lessonInDB.setStartTime(startTime);
        lessonInDB.setEndTime(endTime);

        lessonRepository.save(lessonInDB);
    }

    @Override
    public void deleteLessonById(Integer id) {

        if(getLessonById(id) == null) return;

        lessonRepository.delete(getLessonById(id));
    }
}
