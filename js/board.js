




function renderCard(){
    return `<div class="card">
                        <div class="task_category">Category</div>
                        <p class="task_title">Kochwelt Page & Recipe Recommender</p>
                        <p class="task_description">Build start page with recipe recommendation...</p>
                        <div>
                            <svg id="progress_bar" width="128px" height="8px" xmlns="http://www.w3.org/2000/svg">
                                <!-- Hintergrundrechteck -->
                                <rect width="128px" height="8px" fill="#F4F4F4" rx="4px" ry="4px"/>
                              
                                <!-- Fortschrittsbalken -->
                                <rect width="50%" height="100%" fill="#4589FF" rx="4px" ry="4px"/>
                              </svg>
                              
                            <span class="task_subtask">1/2 Subtasks</span>
                        </div>
                        <div class="task_contacts_prio">
                            <div class="task_contacts"></div>
                            <div class="task_prio">
                                <svg id="task_medium_svg" xmlns="http://www.w3.org/2000/svg" width="45px" height="30px" fill="#FFA800" class="bi bi-pause" viewBox="0 0 16 16">
                                    <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
                                  </svg>
                            </div>
                        </div>
                    </div>`
    }