package com.cryptx.webapp.services.lessonService;

import com.cryptx.webapp.models.Lesson;
import com.cryptx.webapp.models.LessonRequest;
import com.cryptx.webapp.models.Student;

import java.time.DayOfWeek;
import java.time.LocalTime;

public interface LessonService {

    Lesson getLessonById(Integer id);

    void updateLesson(Integer day, String subject, LocalTime startTime, LocalTime endTime, Integer id);

    void deleteLessonById(Integer id);
}
