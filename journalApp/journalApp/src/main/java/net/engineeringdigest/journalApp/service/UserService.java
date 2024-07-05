package net.engineeringdigest.journalApp.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import net.engineeringdigest.journalApp.entity.User;
import net.engineeringdigest.journalApp.repository.UserRepository;

@Component
public class UserService {
    
@Autowired
private UserRepository userRepository;

//post
public void saveUser(User user){

    userRepository.save(user);
    
}
//get
public List<User> getAll(){

    return userRepository.findAll();
}

//get spcific
public Optional<User> getbyId(ObjectId id){

return userRepository.findById(id);

}

//delete
public void deleteEntry(ObjectId id){

    userRepository.deleteById(id);
   
}

public User findByUserName(String userName){
    return userRepository.findByUserName(userName);
}





}