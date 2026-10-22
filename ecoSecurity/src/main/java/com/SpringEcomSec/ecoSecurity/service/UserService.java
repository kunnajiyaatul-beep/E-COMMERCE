package com.SpringEcomSec.ecoSecurity.service;

import com.SpringEcomSec.ecoSecurity.model.User;
import com.SpringEcomSec.ecoSecurity.repo.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepo repo;

    public UserService(UserRepo repo) {
        this.repo = repo;
    }

    public User userSave(User user) {
        return repo.save(user);
    }

    public boolean existsByUsername(String username) {
        return repo.findByUsername(username) != null;
    }
}
