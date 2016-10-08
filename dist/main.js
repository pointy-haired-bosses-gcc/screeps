var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTransporter = require('role.transporter');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(var roomId in Game.rooms)
    {
        var room = Game.rooms[roomId];
        var creepsInRoom = _.filter(Game.creeps, (creep) => creep.room.name === room.name);
        var spawnsInRoom = room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return object.structureType == STRUCTURE_SPAWN;
            }
        });
        var towersInRoom = room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return object.structureType == STRUCTURE_TOWER;
            }
        });

        for (var t in towersInRoom) {
            var tower = towersInRoom[t];

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile && closestHostile.owner.username != 'Bovius') {
                tower.attack(closestHostile);
            }

            if (tower.energy >= tower.energyMax * .5) {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES,
                    { filter: function(o) {
                        return o.hits < o.hitsMax && o.hits <= 5000;
                    }}
                );
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }
        
        var harvesters = _.sum(creepsInRoom, (creep) => creep.memory.role == 'harvester');
        var transporters = _.sum(creepsInRoom, (creep) => creep.memory.role == 'transporter');
        var creepEnergyFactor = ((harvesters + transporters) >= 3) ? room.energyCapacityAvailable : room.energyAvailable;
        if(harvesters < 1) {
            var newName = spawnsInRoom[0].createCreep(roleHarvester.getBuildComponents(creepEnergyFactor), undefined, {role: 'harvester', assignedSource: assignSource(room)});
            if (_.isString(newName)) console.log('Spawning new harvester: ' + newName);
        }
        else if (transporters < 2) {
            var newName = spawnsInRoom[0].createCreep(roleTransporter.getBuildComponents(creepEnergyFactor), undefined, {role: 'transporter'});
            if (_.isString(newName)) console.log('Spawning new transporter: ' + newName);
        }
        else if (harvesters < 2) {
            var newName = spawnsInRoom[0].createCreep(roleHarvester.getBuildComponents(creepEnergyFactor), undefined, {role: 'harvester', assignedSource: assignSource(room)});
            if (_.isString(newName)) console.log('Spawning new harvester: ' + newName);
        }
        else {
            var upgraders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'upgrader');
            if(upgraders < 4) {
                var newName = spawnsInRoom[0].createCreep(roleUpgrader.getBuildComponents(creepEnergyFactor), undefined, {role: 'upgrader'});
                if (_.isString(newName)) console.log('Spawning new upgrader: ' + newName);
            }

            var builders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'builder');
            if (builders < 2) {
                var newName = spawnsInRoom[0].createCreep(roleBuilder.getBuildComponents(creepEnergyFactor), undefined, {role: 'builder'});
                if (_.isString(newName)) console.log('Spawning new builder: ' + newName);
            }

            var repairers = _.sum(creepsInRoom, (creep) => creep.memory.role == 'repairer');
            if (repairers < 1) {
                var newName = spawnsInRoom[0].createCreep(roleRepairer.getBuildComponents(creepEnergyFactor), undefined, {role: 'repairer'});
                if (_.isString(newName)) console.log('Spawning new repairer: ' + newName);
            }
        }

        var tower = Game.getObjectById('TOWER_ID');
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if(creep.memory.role == 'transporter') {
                roleTransporter.run(creep);
            }
        }
    }
}

function assignSource(room) {
    var sources = room.find(FIND_SOURCES);
    var idx = Math.floor(Math.random() * sources.length);

    return sources[idx].id;
}
