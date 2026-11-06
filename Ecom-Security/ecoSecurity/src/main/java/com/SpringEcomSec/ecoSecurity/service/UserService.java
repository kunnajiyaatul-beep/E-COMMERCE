package com.SpringEcomSec.ecoSecurity.service;

import com.SpringEcomSec.ecoSecurity.model.User;
import com.SpringEcomSec.ecoSecurity.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

    public User userSave(User user) {
        return repo.save(user);
    }
}
