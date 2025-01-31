package net.engineeringdigest.MindMentorJournal.repository;


import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import net.engineeringdigest.MindMentorJournal.entity.User;


public interface UserRepository extends MongoRepository<User, ObjectId>{
    
    User findByUserName(String userName);
}
