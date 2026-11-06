package com.SpringEcomSec.ecoSecurity.Config;


import com.SpringEcomSec.ecoSecurity.model.User;
import com.SpringEcomSec.ecoSecurity.repo.UserRepo;
import com.SpringEcomSec.ecoSecurity.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class Oauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException {

        OAuth2User oauth2User =
                (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");

        User user = userRepo.findByUsername(email);

        if (user == null) {

            user = new User();

            user.setUsername(email);

            // Google users don't authenticate using local password
            user.setPassword(null);

            userRepo.save(user);
        }

        String token = jwtService.generateToken(email);

        response.sendRedirect(
                "http://localhost:5175/oauth-success?token="
                        + token
        );
    }
}
