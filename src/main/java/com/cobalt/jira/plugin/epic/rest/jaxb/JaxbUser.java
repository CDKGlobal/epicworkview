package com.cobalt.jira.plugin.epic.rest.jaxb;

import org.codehaus.jackson.annotate.JsonAutoDetect;


@JsonAutoDetect(getterVisibility = JsonAutoDetect.Visibility.PUBLIC_ONLY, fieldVisibility = JsonAutoDetect.Visibility.NONE)
public class JaxbUser {
    String id;
    String name;
    String avatar;
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
        return o == this || (o instanceof JaxbUser && id.equals(((JaxbUser) o).id));
    }

    public int hashCode() {
        return id.hashCode();
    }
}
