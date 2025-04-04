"use strict";

const {Sequelize, DataTypes} = require('sequelize');

const DBFILE = 'fitness.db';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DBFILE,
    define: {
      timestamps: false, // Disabilita i campi createdAt e updatedAt nei modelli
    },
});

connectToDatabase();

async function connectToDatabase() {
    try {
      await sequelize.authenticate();
      console.log('Connessione al database completata');
    } catch (err) {
      console.error('Errore durante la connessione al database:', err);
    }
}
  
const Session = sequelize.define('Session', {
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY, // DATEONLY per memorizzare la data senza l'ora.
      allowNull: false
    },
    unmissable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: []
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
});

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.TEXT,
    },
    lastname: {
      type: DataTypes.TEXT,
    },
    username: {
      type: DataTypes.TEXT,
      unique: true,
    },
    password: {
        type: DataTypes.TEXT,
    },
    email: {
        type: DataTypes.TEXT,
        unique: true,
        validate: {
            isEmail: true
        }
    },
});

const Profile = sequelize.define('Profile', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
});

const List = sequelize.define('List', {
    session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Session,
            key: 'session_id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        }
    }
});

Session.hasMany(List, { foreignKey: 'session_id' });
List.belongsTo(Session, { foreignKey: 'session_id' });
User.hasMany(List, { foreignKey: 'id' });
List.belongsTo(User, { foreignKey: 'id' });
Profile.belongsTo(User, { foreignKey: 'id' });
User.hasOne(Profile, { foreignKey: 'userId' });

module.exports = { sequelize, DataTypes, List, User, Session, Profile };