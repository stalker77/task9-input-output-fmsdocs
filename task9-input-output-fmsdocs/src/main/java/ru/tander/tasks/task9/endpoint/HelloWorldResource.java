/*
* This class realize ...
*
* Created by Eugeny (aka Stalker) on 04.12.2015 
*
* Copyright (c) 2015 Eugeny Dobrokvashin, All Rights Reserved.
*/

package ru.tander.tasks.task9.endpoint;

import ru.tander.tasks.task9.entity.Test;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * @author Evgeny Dobrokvashin
 *         Created by Stalker on 04.12.2015.
 * @version 1.0 Dec 2015
 */
@Path("/helloworld")
public class HelloWorldResource {
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Test hellowWorld() {
    //return "{\"name\":\"val\"}";
    Test test = new Test();
    test.setName("John");
    return test;
  }
}