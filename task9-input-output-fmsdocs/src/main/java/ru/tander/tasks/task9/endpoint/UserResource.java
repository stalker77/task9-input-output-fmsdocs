/*
* This class realize ...
*
* Created by Eugeny (aka Stalker) on 06.12.2015 
*
* Copyright (c) 2015 Eugeny Dobrokvashin, All Rights Reserved.
*/

package ru.tander.tasks.task9.endpoint;

import ru.tander.tasks.task9.dao.UserDao;
import ru.tander.tasks.task9.entity.User;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * @author Evgeny Dobrokvashin
 *         Created by Stalker on 06.12.2015.
 * @version 1.0 Dec 2015
 */
@Path("/user")
public class UserResource {
  UserDao userDao;

  @GET
  @Path("{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public User getUserById(@PathParam("id") int id) {
    return userDao.getById(id);
  }
}
