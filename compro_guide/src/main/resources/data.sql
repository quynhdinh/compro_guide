INSERT INTO courses (course_id, title, description, credits) VALUES ('CS303', 'FPP', 'Fundamental Programming Practices', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS304', 'MPP', 'Modern Programming Practices', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS422', 'DBMS', 'Databases Management Systems', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS425', 'Software Engineering', 'Introduces best practices in software development via a methodology; students apply OO paradigm and UML in a project using the Rational Unified Process.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS435', 'Algorithms', 'Methods for analyzing algorithm efficiency (worst-case & average-case), design and implementation; topics include searching/sorting, data structures, graph algorithms, combinatorial algorithms, dynamic programming, NP-complete problems, special topics like computational geometry, cryptosystems, Big Data, parallel computing. (As of August 2024 this is required.)', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS472', 'Web Application Programming', 'Introduces dynamic web applications; front-end (HTML, CSS, TypeScript, React) and back-end (Node.js, Express in TypeScript).', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS473', 'Mobile Device Programming', 'Focus on Android application development using Kotlin; topics include Android setup, Activities, Views, Fragments, multimedia, sensors, localization, Google Play publishing.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS488', 'Big Data Analytics', 'Covers mining large datasets (with R language, Hadoop/MapReduce, Spark, Flink, Kafka, Storm, NoSQL, etc.), including projects from Kaggle.', 4) ON CONFLICT DO NOTHING;

INSERT INTO courses (course_id, title, description, credits) VALUES ('CS489', 'Applied Software Development', 'Students learn full lifecycle of enterprise-grade software: requirements, analysis, design, implementation, testing, deployment; focuses mostly on Java platform.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('FOR506B', 'Leadership for Technical Managers', 'Provides knowledge and skills in leadership, including communication, and preparation for leadership roles; includes guest speakers from entrepreneurs, computer scientists, academics, etc.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS490', 'Project Management', 'Introduces students to a real project; covers project management framework, knowledge areas (10 areas), deployment; students experience all phases of the SDLC; project developed using Java technologies and frameworks, Web services, Design Patterns.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS516', 'Cloud Computing', 'Covers cloud programming patterns and working with web cloud services including AWS Serverless functions; topics: IAM, VPC, NACL, Subnets, AZs, S3, EC2, SNS, ELB, Auto Scaling, Route 53, AWS Lambda, Web services, Application Deployment.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS522', 'Big Data', 'Covers MapReduce algorithms, Hadoop cluster architecture (HDFS, YARN), web crawling, Spark algorithms, Scala.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS523', 'Big Data Technologies', 'Explores Hadoop ecosystem projects (MapReduce, Pig, Hive, Sqoop, Flume, HBase, Zookeeper) and Spark ecosystem (Spark SQL, Spark Streaming); students build a big-data pipeline from real-time collection to dashboard.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS589', 'Artificial Intelligence', 'Graduate-level introduction to AI; covers machine learning, deep learning, NLP, generative AI (GAN, VAE, LLM/Transformer), semantics, cognitive computing, logic & statistics; group project; tools for parallel, distributed, scalable ML.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS525', 'Advanced Software Design', 'Covers current methods/practices for good design of software systems; topics: design patterns, frameworks, architectures, multi-level abstractions.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS544', 'Enterprise Applications', 'Focuses on principles/practices when developing large-scale enterprise applications; examines architectural layers and technologies (ORM, DI, AOP, REST/SOAP, messaging, RMI). Must have working knowledge of relational DB & SQL;', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS545', 'Web Application Architecture and Frameworks', 'Focuses on enterprise web application development (presentation layer) using things like JSF and SpringMVC.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS572', 'Modern Web Applications', 'Comprehensive exploration of web app development, front-end & back-end, database integration, and latest advances in AI and large language models; topics: Node.js scaling, NoSQL cloud services, Angular Signals, LLM APIs (OpenAI API) & prompt engineering.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS575', 'Practicum in Software Development', 'Students perform tasks in a technical professional position (design/development of new systems or applying existing systems); employer-supervised; 0.5-1 unit per block; may be repeated.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS582', 'Machine Learning', 'In-depth practical and theoretical coverage of ML: supervised/unsupervised, reinforcement learning, HMM, evolutionary computing, deep learning, text/web data processing, machine learning in industries, group project.', 4) ON CONFLICT DO NOTHING;
INSERT INTO courses (course_id, title, description, credits) VALUES ('CS590', 'Software Architecture', 'Techniques, principles, patterns for designing flexible, scalable, testable and resilient software systems with microservices; topics: architectural styles, integration techniques/patterns, domain driven design, event driven architecture, reactive programming.', 4) ON CONFLICT DO NOTHING;


-- Seed reviews (note: reviewId is serial/auto-generated)
-- Associate reviews with course_id CS303
delete from reviews;
	-- @Id
	-- @GeneratedValue(strategy = GenerationType.IDENTITY)
	-- private Long reviewId;
	-- // Foreign key to Course entity
	-- @Column(name = "course_id", nullable = false) 
	-- private String courseId;
	-- @Column(name = "reviewer_name", nullable = false)
	-- private String reviewerName;
	-- @Column(name = "comment", nullable = false)
	-- private String comment;
	-- @Column(name = "rating", nullable = false)
	-- private Integer rating;
	-- @Column(name = "difficulty", nullable = false)
	-- private Integer difficulty;
	-- @Column(name = "workload", nullable = false)
	-- private Integer workload;
	-- @Column(name = "created", nullable = false)
	-- private Integer created;
insert into reviews (course_id, reviewer_name, comment, rating, difficulty, workload, created) values ('CS303', 'Ivan', 'Great introduction to programming concepts.', 5, 3, 4, extract(epoch from now()));
insert into reviews (course_id, reviewer_name, comment, rating, difficulty, workload, created) values ('CS303', 'Jia', 'Challenging but rewarding course.', 4, 4, 5, extract(epoch from now()));
insert into reviews (course_id, reviewer_name, comment, rating, difficulty, workload, created) values ('CS303', 'Hana', 'Well-structured and informative.', 5, 2, 3, extract(epoch from now()));

insert into reviews (course_id, reviewer_name, comment, rating, difficulty, workload, created) values ('CS304', 'Liam', 'Excellent coverage of modern programming paradigms.', 5, 4, 4, extract(epoch from now()));
insert into reviews (course_id, reviewer_name, comment, rating, difficulty, workload, created) values ('CS304', 'Maya', 'Hands-on projects helped solidify concepts.', 4, 3, 4, extract(epoch from now()));
insert into reviews (course_id, reviewer_name, comment, rating, difficulty, workload, created) values ('CS304', 'Noah', 'A bit fast-paced but overall a great learning experience.', 4, 4, 5, extract(epoch from now()));
insert into reviews (course_id, reviewer_name, comment, rating, difficulty, workload, created) values ('CS303', 'Alice', 'Great introduction to programming concepts.', 5, 3, 4, extract(epoch from now()));
insert into reviews (course_id, reviewer_name, comment, rating, difficulty, workload, created) values ('CS303', 'Bob', 'Challenging but rewarding course.', 4, 4, 5, extract(epoch from now())); 