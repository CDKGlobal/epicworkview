package com.cobalt.jira.plugin.epic.rest.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name = "user")
public class JaxbUser {
    @XmlElement(name = "name")
    String name;

    @XmlElement(name = "avatar")
    String avatar;

    public JaxbUser() {

    }

    public String getName() {
        return name;
    }

    public String getAvatar() {
        return avatar;
    }
}
