package com.cryptx.webapp.services.mailService.impl;

import com.cryptx.webapp.services.mailService.MailService;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class MailServiceImpl implements MailService {
    private Session session;
    private static MailServiceImpl instance;

    private MailServiceImpl() {
        login();
    }

    public static synchronized MailServiceImpl getInstance() {
        if (instance == null) {
            synchronized (MailServiceImpl.class) {
                if (instance == null) {
                    instance = new MailServiceImpl();
                }
            }
        }
        return instance;
    }

    private void login() {
        String host = "smtp.gmail.com";
        Properties prop = new Properties();
        prop.put("mail.smtp.host", host);
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.auth", "true");
        session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                        "cheatahmailserver@gmail.com",
                        "Sherlock123");
            }
        });
    }

    public void sendMail(String to, String txt) {
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress("cheatahmailserver@gmail.com"));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setSubject("CRYPTX");
            String text = txt + " !!!";
            message.setContent(text, "text/html; charset=UTF-8");
            Transport.send(message);
        } catch (Exception ex) {
            System.out.println(ex.toString());
        }
    }


}

