package com.example.application;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Entity 
public class Todo {

  @Getter
  @Setter
  @Id
  @GeneratedValue
  private Integer id;

  @Setter
  @Getter
  private boolean done = false;

  @Getter
  @Setter
  @NotBlank 
  private String task;

  public Todo() {}

  public Todo(String task) {
    this.task = task;
  }
}