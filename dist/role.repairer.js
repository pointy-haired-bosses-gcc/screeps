var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvesting');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('working');
        }

        if(creep.memory.working) {
            var repairTargets = creep.room.find(FIND_STRUCTURES, { filter: function(s) { return s.hits < s.hitsMax && s.hits < 100000; }});
            if(repairTargets.length) {
                if(creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0]);
                }
            }
            else
            {
                var constructionTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(creep.build(constructionTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionTargets[0]);
                }
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

module.exports = roleRepairer;
