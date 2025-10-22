package com.quynhdv.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import io.restassured.RestAssured;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CourseControllerRestAssuredTests {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setup() {
        baseURI = "http://localhost";
        basePath = "/api/courses";
        RestAssured.port = port;
    }

    @Test
    void testGetAllCourses() {
        given()
            .when()
                .get("/")
            .then()
                .statusCode(200)
                .body("", hasSize(greaterThanOrEqualTo(0)));
    }
}
