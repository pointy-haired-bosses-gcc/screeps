var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
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
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(structure) {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_SPAWN) 
                            && structure.energy < structure.energyCapacity;
                    }
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    },
    getBuildComponents: function(roomEnergy) {
        if (roomEnergy >= 1300) {
            return [WORK,CARRY,CARRY,CARRY,MOVE,MOVE];
        }
        else if (roomEnergy >= 800) {
            return [WORK,CARRY,CARRY,MOVE,MOVE];
        }
        else if (roomEnergy >= 300) {
            return [WORK,CARRY,MOVE];
        }
    }
};

module.exports = roleTransporter;
