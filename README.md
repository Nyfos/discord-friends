<div align="center">
  <p>
    <a href="https://discord.gg/q6eMWS2"><img src="https://discordapp.com/api/guilds/616371260569681930/embed.png" alt="Serveur Discord" /></a>
    <a href="https://www.npmjs.com/package/discord-friends"><img src="https://img.shields.io/npm/v/discord-friends.svg?maxAge=3600" alt="Version NPM" /></a>
    <a href="https://www.npmjs.com/package/discord-friends"><img src="https://img.shields.io/npm/dt/discord-friends.svg?maxAge=3600" alt="Téléchargements NPM" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord-friends/"><img src="https://nodei.co/npm/discord-friends.png?downloads=true&stars=true" alt="Informations NPM" /></a>
  </p>
</div>

## À propos
discord-friends est un module NPM permettant d'ajouter des amis et d'être tenu au courant des évènements sélectionnés relatifs à vos amis.

Disponible avec Discord.js V11 et V12.

- Simple d'utilisation
- Utile
- Rapide mise en place

## Installation

`npm install discord-friends`

## Exemple d'utilisation
```js
const Discord = require("discord.js")
const client = new Discord.Client();

const discordfriends = require("discord-friends");
var options = {
  friendConnection: "L'un de vos amis vient de se connecter !",
  ignoredUsers: [481077432452120586, 456226577798135808]
}
var DiscordFriends = new discordfriends(client, options)

DiscordFriends.on('newFriend', (userID, friendID, options) => {
  console.log(`${userID} a ajouté un ami, ${friendID}.`)
})

client.login("token")
```

## Options

| Option              |              Description              |                    Type |   Default |
| :------------------ | :-----------------------------------: | ----------------------: | --------: |
| `maxFriends`        |     Maximum d'amis par utilisateur    |  Number [-1 = illimité] |      `-1` |
| `statusDetection`   |  Détection des changements de statut  |                 Boolean |    `true` |
| `mentionDetection`  | Détection des mentions d'utilisateurs |                 Boolean |    `true` |
| `mentions`          |      Mentions en messages privés      |                 Boolean |    `true` |
| `friendConnect`     |         Message de connection         |                  String |   Voir "1 |
| `friendDisconnect`  |        Message de déconnection        |                  String |   Voir "2 |
| `mentionned`        |          Message de mentions          |                  String |   Voir "3 |
| `usersFriends`      |             Liste d'amis              |                   Array |      `{}` |
| `ignoredUsers`      |     Liste d'utilisateurs à ignorer    |                  Object |      `[]` |

"1 : `"one of your friends just connected!"`

"2 : `"one of your friends just disconnected!"`

"3 : `"one of your friends just mention you!"`

## Méthodes

| Méthode                          |                           Description |
| :------------------------------- | ------------------------------------: |
| `.add(id, friendID, options)`    |                         Ajoute un ami |
| `.remove(id, friendID)`          |                       Supprime un ami |
| `.update(id, friendID, options)` |                     Met à jour un ami |
| `.users()`                       |     Obtenir la liste des utilisateurs |
| `.clear()`                       |   Supprimer la liste des utilisateurs |

## Events

| Évènement           | Description                                                    |
| :------------------ | :------------------------------------------------------------- |
| `newFriend`         | Émis quand une nouvelle paire utilisateur-ami est créée        |
| `removeFriend`      | Émis quand une paire utilisateur-ami est supprimée             |
| `updateFriend`      | Émis quand une paire utilisateur-ami est mise à jour           |
| `userListRetrieved` | Émis quand la méthode `.users()` est appellée                  |
| `cleared`           | Émis quand la liste des paires utilisateurs-amis est supprimée |

*La liste des réponses des évènements est disponible ci-dessous*

## Réponses Events

| Évènement           | Réponse                                             |
| :------------------ | :-------------------------------------------------- |
| `newFriend`         | `( id, idAmi, optionsAmi, pairesUtilisateursAmis )` |
| `removeFriend`      | `( id, idAmi, pairesUtilisateursAmis )`             |
| `updateFriend`      | `( id, idAmi, optionsAmi, pairesUtilisateursAmis )` |
| `userListRetrieved` | `( pairesUtilisateursAmis )`                        |
| `cleared`           | `( pairesUtilisateursAmis )`                        |

## Liens

* [GitHub](https://github.com/Nyfos/discord-friends)
* [NPM](https://www.npmjs.com/package/discord-friends)