var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(structure) {
                        return structure.structureType == STRUCTURE_CONTAINER
                            && structure.store[RESOURCE_ENERGY] > 0;
                    }
            });
            if (target) {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    },
    getBuildComponents: function(roomEnergy) {
        if (roomEnergy >= 1300) {
            return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        }
        else if (roomEnergy >= 1050) {
            return [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        }
        else if (roomEnergy >= 800) {
            return [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        }
        else if (roomEnergy >= 550) {
            return [WORK,WORK,CARRY,MOVE,MOVE];
        }
        else if (roomEnergy >= 300) {
            return [WORK,CARRY,MOVE];
        }
    }
};

module.exports = roleUpgrader;
