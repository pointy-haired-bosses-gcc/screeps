var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(structure) {
                        return structure.structureType == STRUCTURE_CONTAINER
                            && _.sum(structure.store) < structure.storeCapacity;
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
            return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
        }
        else if (roomEnergy >= 1050) {
            return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE];
        }
        else if (roomEnergy >= 800) {
            return [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        }
        else if (roomEnergy >= 550) {
            return [WORK,WORK,CARRY,CARRY,MOVE];
        }
        else if (roomEnergy >= 300) {
            return [WORK,CARRY,MOVE];
        }
    }
};

module.exports = roleHarvester;
