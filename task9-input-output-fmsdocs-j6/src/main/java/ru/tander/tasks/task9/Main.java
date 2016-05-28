/*
* This class developed for realize main app running Spring app context with Jetty and Jersey on board
*
* Created by Evgeny Dobrokvashin (aka Stalker) on 22.09.15
*
* Copyright (c) 2015 Tander, All Rights Reserved.
*/
package ru.tander.tasks.task9;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.xml.XmlConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Main App
 *
 * @author Evgeny Dobrokvashin
 * @version 1.0 nov 2015
 *
 * Created by Stalker on 29.11.15.
 */
public class Main {
	private static final Logger LOG = LoggerFactory.getLogger(Main.class);

	public static void main( String[] args ) {
		if (LOG.isDebugEnabled()) {
			LOG.debug("JRE Version: " + System.getProperty("java.version"));
			LOG.debug("Current dir: " + System.getProperty("user.dir"));
			LOG.debug("Enter to main()");
		}

		try {
			Resource jettyConfig = Resource.newResource("cfg/jettyConfig.xml");
			XmlConfiguration configuration = new XmlConfiguration(jettyConfig.getInputStream());
			Server server = (Server)configuration.configure();
			server.start();
			LOG.info("Server started!");
			server.join();
		} catch (Exception e) {
			LOG.error("General error: ", e);
		} finally {
			if (LOG.isDebugEnabled()) {
				LOG.debug("Exit from main()");
			}
		}
	}
}
