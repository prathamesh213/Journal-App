package net.engineeringdigest.MindMentorJournal.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.engineeringdigest.MindMentorJournal.entity.User;
import net.engineeringdigest.MindMentorJournal.service.UserService;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers(){
        
        return userService.getAll();
    }

    @PostMapping
    public void addUser(@RequestBody User user) {
        userService.saveUser(user);
    }
    
     @PutMapping("/{userName}")
  public ResponseEntity<?> updateUser(@RequestBody User user, @PathVariable String userName) {
      
       User userInDb = userService.findByUserName(userName);

       if(userInDb != null){
        userInDb.setUserName(user.getUserName());
        userInDb.setPassword(user.getPassword()); 
        userService.saveUser(userInDb);
       }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
  }
  


