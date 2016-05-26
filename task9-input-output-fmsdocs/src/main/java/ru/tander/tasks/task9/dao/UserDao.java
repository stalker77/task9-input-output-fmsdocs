package ru.tander.tasks.task9.dao;

import ru.tander.tasks.task9.entity.User;

import java.util.List;

/**
 * @author Evgeny Dobrokvashin
 *         Created by Stalker on 06.12.2015.
 * @version 1.0 Dec 2015
 */
public interface UserDao {
  User getById(int id);

  List<User> getList();
}
