var roleBuilder = {

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
            var constructionTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(constructionTargets.length) {
                if(creep.build(constructionTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionTargets[0]);
                }
            }
            else
            {
                var repairTargets = creep.room.find(FIND_STRUCTURES, { filter: function(s) { return s.hits < s.hitsMax && s.hits < 100000; }});
                if(creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0]);
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

module.exports = roleBuilder;
