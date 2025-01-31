package net.engineeringdigest.MindMentorJournal.service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import net.engineeringdigest.MindMentorJournal.entity.JournalEntry;
import net.engineeringdigest.MindMentorJournal.entity.User;
import net.engineeringdigest.MindMentorJournal.repository.JournalEntryRepository;

@Component
public class JournalEntryService {
    
@Autowired
private JournalEntryRepository journalEntryRepository;

@Autowired
private UserService userService;

//save entries
@Transactional
public void saveEntry(JournalEntry journalEntry, String userName){
    try {
       
        User user = userService.findByUserName(userName);
        journalEntry.setDate(LocalDateTime.now());
        JournalEntry saved =  journalEntryRepository.save(journalEntry);    
        user.getJournalEntries().add(saved);
        userService.saveUser(user);
    
    } catch (Exception e) {
       System.out.println(e);
       throw new RuntimeException("Kuch faat gaya hai, ghode ",e);
    }
   
}


public void saveEntry(JournalEntry journalEntry){
    
    journalEntryRepository.save(journalEntry);

}
//get
public List<JournalEntry> getAll(){

    return journalEntryRepository.findAll();
}

//get spcific
public Optional<JournalEntry> getbyId(ObjectId id){
return journalEntryRepository.findById(id);

}

//delete
public void deleteEntry(ObjectId id, String userName){
     
    User user = userService.findByUserName(userName);
     user.getJournalEntries().removeIf(x -> x.getId().equals(id));  
     userService.saveUser(user);
     journalEntryRepository.deleteById(id);

    

}

//put





}