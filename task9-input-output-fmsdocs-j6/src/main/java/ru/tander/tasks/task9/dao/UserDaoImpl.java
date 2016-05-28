/*
* This class realize ...
*
* Created by Eugeny (aka Stalker) on 06.12.2015 
*
* Copyright (c) 2015 Eugeny Dobrokvashin, All Rights Reserved.
*/

package ru.tander.tasks.task9.dao;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import ru.tander.tasks.task9.entity.User;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * @author Evgeny Dobrokvashin
 *         Created by Stalker on 06.12.2015.
 * @version 1.0 Dec 2015
 */
public class UserDaoImpl extends JdbcDaoSupport implements UserDao {
  @Override
  public User getById(int id) {
    User result = null;
    List<User> userList = getJdbcTemplate().query("select id from User where id = " + id,
            new RowMapper<User>() {
              @Override
              public User mapRow(ResultSet resultSet, int i) throws SQLException {
                User user = new User();
                user.setId(resultSet.getInt(1));
                return user;
              }
            }
    );

    if (userList.size() > 0) {
      result = userList.get(0);
    }

    return result;
  }

  @Override
  public List<User> getList() {
    List<User> result = getJdbcTemplate().query("select ",
            new RowMapper<User>() {
              @Override
              public User mapRow(ResultSet resultSet, int i) throws SQLException {
                User user = new User();
                user.setId(resultSet.getInt(1));
                return user;
              }
            }
    );

    return result;
  }
}
