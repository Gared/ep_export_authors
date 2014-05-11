# ep_export_authors
Etherpad plugin to add author information to the html export.
It adds a span attribute around each text of an author with his name and a random generated color. The color of an author keeps the same until the server will be restarted or the plugin reloaded.
The author color should be loaded from the database, but this is not possible at this time (synchronous call of the plugin method).
