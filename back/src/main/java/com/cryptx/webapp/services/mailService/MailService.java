package com.cryptx.webapp.services.mailService;

import com.cryptx.webapp.services.mailService.impl.MailServiceImpl;

public interface MailService {
    public static MailServiceImpl getInstance() {
        return null;
    }
    public void sendMail(String to, String txt);
}
