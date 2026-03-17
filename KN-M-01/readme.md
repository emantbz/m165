# KN-M-01: Installation und Verwaltung von MongoDB

## A) Installation

### Cloud-Init Datei

[Datei herunterladen](assets/cloudinit-mongodb.yaml)

---

### Screenshot MongoDB Compass

![MongoDB Compass](assets/mongodb-compass.png)
---

### Erklärung Connection String

Verwendeter Connection String:

```
mongodb://adminUser:Test1234!@34.232.169.78:27017/?authSource=admin
```

Der Parameter `authSource=admin` gibt an, in welcher Datenbank die Benutzerinformationen gespeichert sind. MongoDB überprüft die Anmeldedaten genau in dieser Datenbank. Da der Benutzer `adminUser` in der Datenbank `admin` erstellt wurde, ist dieser Parameter notwendig. Wird eine andere Datenbank angegeben, schlägt die Authentifizierung fehl.

---

### Erklärung der sed-Befehle

Im Cloud-Init wurden zwei `sed`-Befehle verwendet:

1. Aktivierung der Authentifizierung:

   * Entfernt das Kommentarzeichen vor der `security`-Konfiguration.
   * Dadurch wird die Authentifizierung in MongoDB aktiviert.

2. Anpassung der Netzwerk-Konfiguration:

   * Ersetzt die lokale IP-Adresse `127.0.0.1` durch `0.0.0.0`.
   * Dadurch wird der Zugriff von externen Systemen (z. B. MongoDB Compass) ermöglicht.

Diese beiden Anpassungen sind notwendig, damit:

* Benutzer sich authentifizieren müssen (Sicherheit)
* eine Verbindung von ausserhalb der AWS-Instanz möglich ist

---

### Screenshot MongoDB Konfigurationsdatei

![MongoDB Config Datei](assets/mongodb-conf.png)

---

## B) Erste Schritte GUI

### Dokument vor dem Einfügen

```json
{
  "name": "Eman",
  "age": 25,
  "address": "Zürich",
  "birthdate": "2000-01-01"
}
```

![Dokument bevor](assets/mongodb-compass.png)

---

### Screenshot nach Anpassung

![Dokument nacher](assets/mongo-doc-after.png)

---

### Export-Datei

[Datei herunterladen](assets/Mujanovic.Eman.json)

---

### Erklärung Datentyp Datum

Das Datum wurde zunächst als String gespeichert:

```json
"birthdate": "2000-01-01"
```

JSON kennt keinen eigenen Datentyp für Datum. Deshalb wird der Wert standardmässig als String interpretiert.

Damit MongoDB das Datum korrekt als Datum speichert, muss das sogenannte Extended JSON (BSON) verwendet werden:

```json
"birthdate": { "$date": "2000-01-01T00:00:00Z" }
```

Dieser Weg ist notwendig, da MongoDB intern mit BSON arbeitet, welches zusätzliche Datentypen wie Datum unterstützt. Ohne diese spezielle Syntax wird das Datum nicht korrekt erkannt, was zu Problemen bei Abfragen und Sortierungen führen kann.

---

## C) Erste Schritte Shell

### Verwendete Befehle

```javascript
show dbs;
show databases;
use DeinNachname;
show collections;
show tables;
var test="hallo";
test;
```

![Compass Shell Befehle](assets/compass-shell-befehle.png)

---

### Server Shell

![Server Shell Befehle](assets/server-shell-befehle.png)

---

### Erklärung der Befehle

* `show dbs` / `show databases`
  → Zeigt alle vorhandenen Datenbanken an

* `use <Datenbank>`
  → Wechselt zur angegebenen Datenbank

* `show collections`
  → Zeigt alle Collections innerhalb der Datenbank

* `show tables`
  → Alias für `show collections`

---

### Unterschied Collections vs Tables

Collections sind die MongoDB-Entsprechung zu Tabellen in relationalen Datenbanken.
Der Unterschied ist, dass Collections schemafrei sind und Dokumente unterschiedliche Strukturen haben können, während Tabellen in SQL-Datenbanken eine feste Struktur mit definierten Spalten besitzen.

---

### JavaScript in MongoDB Shell

Die MongoDB Shell basiert auf JavaScript. Deshalb können Variablen wie `var test = "hallo";` definiert und verwendet werden.

---

## D) Rechte und Rollen

---

### Fehler bei falschem authSource

![Falscher authSource](assets/falscher-authsource.png)

Erklärung:
Wird eine falsche Authentifizierungsdatenbank angegeben, kann MongoDB den Benutzer nicht finden und die Anmeldung schlägt fehl.

---

### Benutzer-Erstellung

```javascript
use DeinNachname

db.createUser({
  user: "reader",
  pwd: "pass123",
  roles: [ { role: "read", db: "DeinNachname" } ]
})

use admin

db.createUser({
  user: "writer",
  pwd: "pass123",
  roles: [ { role: "readWrite", db: "DeinNachname" } ]
})
```

---

### Benutzer 1 (reader)

* Login erfolgreich 
* Lesen von Daten möglich 
* Schreiben von Daten nicht erlaubt 

![Reader Acc](assets/reader.png)

---

### Benutzer 2 (writer)

* Login erfolgreich 
* Lesen von Daten möglich 
* Schreiben von Daten möglich 

![Writer Acc](assets/writer.png)

---

### Erklärung Rollen

Die Rolle `read` erlaubt nur das Lesen von Daten.
Die Rolle `readWrite` erlaubt zusätzlich das Einfügen, Ändern und Löschen von Daten.

---

### Bedeutung von authSource

Der Parameter `authSource` bestimmt, in welcher Datenbank die Benutzer authentifiziert werden.
Da Benutzer in einer bestimmten Datenbank gespeichert werden, ist es notwendig, beim Verbindungsaufbau die korrekte Datenbank anzugeben. Andernfalls schlägt die Anmeldung fehl.

---
