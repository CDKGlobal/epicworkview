package com.cobalt.jira.plugin.epic.rest.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name = "user")
public class JaxbUser {
    @XmlElement(name = "id")
    String id;

    @XmlElement(name = "name")
    String name;

    @XmlElement(name = "avatar")
    String avatar;

    @XmlElement(name = "timestamp")
    long timestamp;

    public JaxbUser() {

    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAvatar() {
        return avatar;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public boolean equals(Object o) {
        if(o == this) {
            return true;
        }

        if(!(o instanceof JaxbUser)) {
            return false;
        }

        return id.equals(((JaxbUser) o).id);
    }

    public int hashCode() {
        return id.hashCode();
    }
}
