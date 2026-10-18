import { calculateQuestionScore, calculateRatingDelta, getLevelFromXP } from "./scoring";
import { determinePlayerArchetype } from "./archetypes";

// User entity
export interface UserRecord {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  passwordHash?: string;
  preferredLanguage: string;
  ageBracket: string;
  country: string;
  college?: string;
  school?: string;
  profession?: string;
  examPreparation?: string;
  interests: string[];
  role: "USER" | "QUIZ_MASTER" | "ADMIN";
  rating: number; // MMR e.g. 1540
  xp: number;
  level: number;
  coins: number;
  streak: number;
  longestStreak: number;
  matchesPlayed: number;
  matchesWon: number;
  accuracy: number;
  totalQuestionsAnswered: number;
  bestAnswerStreak: number;
  archetype: "SPEEDSTER" | "STRATEGIST" | "CLUTCHER" | "SCHOLAR" | "SPECIALIST" | "UNRANKED";
  bio?: string;
  isVerifiedCreator?: boolean;
  creatorRating?: number;
  creatorFollowersCount?: number;
  createdAt: string;
}

// Question Option
export interface QuestionOption {
  id: string;
  text: string;
}

// Question Record
export interface QuestionRecord {
  id: string;
  quizId?: string;
  type:
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "MULTIPLE_CORRECT"
    | "NUMERICAL"
    | "IMAGE_BASED"
    | "AUDIO_BASED"
    | "MATCHING"
    | "ORDERING"
    | "ASSERTION_REASON"
    | "CASE_BASED";
  questionText: string;
  explanation: string;
  options: QuestionOption[];
  correctAnswers: string[]; // option ids or numerical strings
  imageUrl?: string;
  audioUrl?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  basePoints: number;
  timeLimitSec: number;
  category: string;
  totalAttempts: number;
  correctAttempts: number;
  actualSuccessRate: number;
  systemDifficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
}

// Quiz Record
export interface QuizRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  subject?: string;
  topic?: string;
  coverImage?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  dynamicDifficulty: number;
  isPublished: boolean;
  playCount: number;
  rating: number;
  timeLimitSec: number;
  tags: string[];
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  questions: QuestionRecord[];
}

// Match Participant in The Ring
export interface MatchParticipantRecord {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  rating: number;
  currentScore: number;
  currentRank: number;
  currentStreak: number;
  highestStreak: number;
  speedBonusTotal: number;
  streakBonusTotal: number;
  correctCount: number;
  finalPosition?: number;
  xpEarned?: number;
  coinsEarned?: number;
  ratingDelta?: number;
  isBot?: boolean;
  answersSubmitted: Record<number, {
    selectedAnswer: string[];
    isCorrect: boolean;
    timeTakenSec: number;
    points: number;
  }>;
}

// Match Record in The Ring
export interface MatchRecord {
  id: string;
  code: string;
  mode: "QUICK_MATCH" | "ONE_VS_ONE" | "MULTIPLAYER" | "FRIEND_BATTLE" | "TOURNAMENT";
  status: "WAITING" | "STARTING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  category: string;
  quizId: string;
  maxPlayers: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  roundTimeLimitSec: number;
  participants: MatchParticipantRecord[];
  questions: QuestionRecord[];
  createdAt: string;
  endedAt?: string;
}

// Journey Track
export interface JourneySubject {
  id: string;
  title: string;
  icon: string;
  description: string;
  progressPercent: number;
  topics: {
    id: string;
    title: string;
    description: string;
    lessons: {
      id: string;
      title: string;
      completed: boolean;
      mastery: number; // 0 to 100
      weakAreas: string[];
    }[];
  }[];
}

// Tournament Record
export interface TournamentRecord {
  id: string;
  title: string;
  description: string;
  type: "DAILY" | "WEEKLY" | "MONTHLY" | "COLLEGE" | "CORPORATE";
  status: "UPCOMING" | "REGISTRATION" | "QUALIFIER" | "ROUND_2" | "SEMIFINAL" | "FINAL" | "COMPLETED";
  category: string;
  entryFeeCoins: number;
  prizePoolCoins: number;
  maxParticipants: number;
  registeredCount: number;
  currentRound: number;
  totalRounds: number;
  startTime: string;
}

// Seeded In-Memory State
class QuizVerseStore {
  public users: Map<string, UserRecord> = new Map();
  public quizzes: Map<string, QuizRecord> = new Map();
  public matches: Map<string, MatchRecord> = new Map();
  public tournaments: Map<string, TournamentRecord> = new Map();
  public notifications: Map<string, Array<{
    id: string;
    userId: string;
    title: string;
    body: string;
    type: string;
    actionUrl?: string;
    isRead: boolean;
    createdAt: string;
  }>> = new Map();
  public friendChallenges: Map<string, {
    id: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    quizId: string;
    quizTitle: string;
    senderScore: number;
    receiverScore?: number;
    status: "PENDING" | "COMPLETED";
    createdAt: string;
  }> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Demo Users
    const defaultUser: UserRecord = {
      id: "usr_demo_1",
      email: "challenger@quizverse.io",
      username: "AyaanMaster",
      displayName: "Ayaan B.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      preferredLanguage: "en",
      ageBracket: "18-24",
      country: "IN",
      college: "IIT Bombay",
      profession: "Engineering Student",
      examPreparation: "UPSC & Tech Olympiad",
      interests: ["Economics", "Quantum Physics", "Global Geopolitics", "AI & Tech"],
      role: "USER",
      rating: 1680,
      xp: 18450,
      level: 11,
      coins: 840,
      streak: 21,
      longestStreak: 21,
      matchesPlayed: 342,
      matchesWon: 218,
      accuracy: 84.2,
      totalQuestionsAnswered: 6842,
      bestAnswerStreak: 17,
      archetype: "STRATEGIST",
      createdAt: new Date().toISOString(),
    };

    const quizMasterRahul: UserRecord = {
      id: "usr_creator_rahul",
      email: "rahul@quizverse.io",
      username: "RahulSharmaQM",
      displayName: "Rahul Sharma (Quiz Master)",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      preferredLanguage: "en",
      ageBracket: "25-34",
      country: "IN",
      interests: ["Economics", "Public Finance", "Monetary Policy"],
      role: "QUIZ_MASTER",
      rating: 2150,
      xp: 142000,
      level: 38,
      coins: 14500,
      streak: 45,
      longestStreak: 45,
      matchesPlayed: 1240,
      matchesWon: 980,
      accuracy: 92.5,
      totalQuestionsAnswered: 18400,
      bestAnswerStreak: 32,
      archetype: "SCHOLAR",
      bio: "National Quiz Finalist & Economics Lead. Author of 42 high-intensity analytical quizzes on Substack and QuizVerse.",
      isVerifiedCreator: true,
      creatorRating: 4.9,
      creatorFollowersCount: 8420,
      createdAt: new Date().toISOString(),
    };

    const quizMasterPriya: UserRecord = {
      id: "usr_creator_priya",
      email: "priya@quizverse.io",
      username: "PriyaCurious",
      displayName: "Dr. Priya Nair",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      preferredLanguage: "en",
      ageBracket: "25-34",
      country: "IN",
      interests: ["Neuroscience", "Physics", "AI"],
      role: "QUIZ_MASTER",
      rating: 1980,
      xp: 98000,
      level: 29,
      coins: 6800,
      streak: 30,
      longestStreak: 30,
      matchesPlayed: 850,
      matchesWon: 620,
      accuracy: 89.0,
      totalQuestionsAnswered: 12000,
      bestAnswerStreak: 24,
      archetype: "SPECIALIST",
      bio: "Neuroscience researcher & Science Olympiad curator. Designing visual and assertion-reason quizzes.",
      isVerifiedCreator: true,
      creatorRating: 4.8,
      creatorFollowersCount: 6150,
      createdAt: new Date().toISOString(),
    };

    this.users.set(defaultUser.id, defaultUser);
    this.users.set(defaultUser.username.toLowerCase(), defaultUser);
    this.users.set(quizMasterRahul.id, quizMasterRahul);
    this.users.set(quizMasterPriya.id, quizMasterPriya);

    // 2. Seed High-Quality Quizzes across diverse Question Types (PRD Section 13 & 26)
    const econQuizQuestions: QuestionRecord[] = [
      {
        id: "q_econ_1",
        type: "MULTIPLE_CHOICE",
        questionText: "Which institution controls monetary policy in India?",
        explanation: "The Reserve Bank of India (RBI) controls monetary policy through tools like Repo Rate, Reverse Repo, and CRR.",
        options: [
          { id: "A", text: "SEBI" },
          { id: "B", text: "Reserve Bank of India (RBI)" },
          { id: "C", text: "NITI Aayog" },
          { id: "D", text: "Ministry of Finance" },
        ],
        correctAnswers: ["B"],
        difficulty: "EASY",
        basePoints: 100,
        timeLimitSec: 15,
        category: "Economics",
        totalAttempts: 1420,
        correctAttempts: 1290,
        actualSuccessRate: 0.91,
        systemDifficulty: "EASY",
      },
      {
        id: "q_econ_2",
        type: "MULTIPLE_CHOICE",
        questionText: "When the RBI raises the Repo Rate, what is the expected impact on market liquidity and inflation?",
        explanation: "Higher repo rate increases borrowing costs for banks, cooling down money supply and curbing inflation.",
        options: [
          { id: "A", text: "Liquidity expands, inflation accelerates" },
          { id: "B", text: "Liquidity tightens, inflation is contained" },
          { id: "C", text: "No change in commercial lending rates" },
          { id: "D", text: "Foreign exchange reserves automatically decrease" },
        ],
        correctAnswers: ["B"],
        difficulty: "MEDIUM",
        basePoints: 100,
        timeLimitSec: 15,
        category: "Economics",
        totalAttempts: 1100,
        correctAttempts: 780,
        actualSuccessRate: 0.71,
        systemDifficulty: "MEDIUM",
      },
      {
        id: "q_econ_3",
        type: "ASSERTION_REASON",
        questionText: "Assertion (A): High fiscal deficit often triggers demand-pull inflation. Reason (R): Deficit financing increases aggregate money circulation in the economy.",
        explanation: "Both (A) and (R) are true, and (R) is the correct explanation of (A) because deficit spending injects liquidity.",
        options: [
          { id: "A", text: "Both A and R are true, and R is the correct explanation of A" },
          { id: "B", text: "Both A and R are true, but R is NOT the correct explanation of A" },
          { id: "C", text: "A is true, but R is false" },
          { id: "D", text: "A is false, but R is true" },
        ],
        correctAnswers: ["A"],
        difficulty: "HARD",
        basePoints: 100,
        timeLimitSec: 20,
        category: "Economics",
        totalAttempts: 950,
        correctAttempts: 410,
        actualSuccessRate: 0.43,
        systemDifficulty: "HARD",
      },
      {
        id: "q_econ_4",
        type: "TRUE_FALSE",
        questionText: "A downward sloping Phillips Curve demonstrates that unemployment and inflation have an inverse relationship in the short run.",
        explanation: "According to A.W. Phillips, short-run economic expansion lowers unemployment while increasing wage pressures and inflation.",
        options: [
          { id: "A", text: "True" },
          { id: "B", text: "False" },
        ],
        correctAnswers: ["A"],
        difficulty: "MEDIUM",
        basePoints: 100,
        timeLimitSec: 12,
        category: "Economics",
        totalAttempts: 880,
        correctAttempts: 640,
        actualSuccessRate: 0.72,
        systemDifficulty: "MEDIUM",
      },
      {
        id: "q_econ_5",
        type: "NUMERICAL",
        questionText: "If the Cash Reserve Ratio (CRR) is set at 5%, what is the theoretical maximum Money Multiplier (1/CRR)?",
        explanation: "Money Multiplier formula = 1 / CRR = 1 / 0.05 = 20.",
        options: [
          { id: "A", text: "10" },
          { id: "B", text: "15" },
          { id: "C", text: "20" },
          { id: "D", text: "25" },
        ],
        correctAnswers: ["C"],
        difficulty: "HARD",
        basePoints: 100,
        timeLimitSec: 15,
        category: "Economics",
        totalAttempts: 720,
        correctAttempts: 320,
        actualSuccessRate: 0.44,
        systemDifficulty: "HARD",
      },
    ];

    const econQuiz: QuizRecord = {
      id: "quiz_econ_master",
      title: "Monetary Policy & Macro Economics",
      description: "Deep dive into central banking, inflation mechanics, repo rates, and macroeconomic balance.",
      category: "Economics",
      subject: "Economics",
      topic: "Monetary Policy",
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80",
      difficulty: "HARD",
      dynamicDifficulty: 3.2,
      isPublished: true,
      playCount: 12842,
      rating: 4.9,
      timeLimitSec: 15,
      tags: ["Monetary Policy", "UPSC", "RBI", "Macroeconomics"],
      creatorId: quizMasterRahul.id,
      creatorName: quizMasterRahul.displayName,
      creatorAvatar: quizMasterRahul.avatarUrl,
      questions: econQuizQuestions,
    };

    const techQuizQuestions: QuestionRecord[] = [
      {
        id: "q_tech_1",
        type: "MULTIPLE_CHOICE",
        questionText: "In Transformer architecture (Vaswani et al.), what mechanism allows tokens to attend to all previous tokens simultaneously?",
        explanation: "Self-Attention (Scaled Dot-Product Attention) computes relationships across all tokens in parallel.",
        options: [
          { id: "A", text: "Recurrent Hidden State" },
          { id: "B", text: "Multi-Head Self-Attention" },
          { id: "C", text: "Convolutional Kernels" },
          { id: "D", text: "Backpropagation Through Time" },
        ],
        correctAnswers: ["B"],
        difficulty: "HARD",
        basePoints: 100,
        timeLimitSec: 15,
        category: "Technology",
        totalAttempts: 890,
        correctAttempts: 560,
        actualSuccessRate: 0.63,
        systemDifficulty: "HARD",
      },
      {
        id: "q_tech_2",
        type: "MULTIPLE_CHOICE",
        questionText: "What consensus mechanism is utilized by the Ethereum network following 'The Merge' in 2022?",
        explanation: "Ethereum transitioned from Proof of Work to Proof of Stake (PoS) in September 2022.",
        options: [
          { id: "A", text: "Proof of Work (PoW)" },
          { id: "B", text: "Proof of Stake (PoS)" },
          { id: "C", text: "Delegated Byzantine Fault Tolerance" },
          { id: "D", text: "Proof of History" },
        ],
        correctAnswers: ["B"],
        difficulty: "EASY",
        basePoints: 100,
        timeLimitSec: 15,
        category: "Technology",
        totalAttempts: 1500,
        correctAttempts: 1320,
        actualSuccessRate: 0.88,
        systemDifficulty: "EASY",
      },
      {
        id: "q_tech_3",
        type: "MULTIPLE_CHOICE",
        questionText: "What does the CAP Theorem state a distributed system cannot simultaneously guarantee across network partitions?",
        explanation: "CAP theorem states a system can only guarantee at most 2 out of Consistency, Availability, and Partition Tolerance.",
        options: [
          { id: "A", text: "Consistency, Availability, Partition Tolerance" },
          { id: "B", text: "Concurrency, Atomicity, Performance" },
          { id: "C", text: "Capacity, Accuracy, Persistence" },
          { id: "D", text: "Compute, Authentication, Privacy" },
        ],
        correctAnswers: ["A"],
        difficulty: "MEDIUM",
        basePoints: 100,
        timeLimitSec: 15,
        category: "Technology",
        totalAttempts: 1120,
        correctAttempts: 840,
        actualSuccessRate: 0.75,
        systemDifficulty: "MEDIUM",
      },
    ];

    const techQuiz: QuizRecord = {
      id: "quiz_tech_ai",
      title: "AI Architectures & Distributed Systems",
      description: "Test your mastery on deep learning attention models, blockchain consensus, and distributed system limits.",
      category: "Technology",
      subject: "Computer Science",
      topic: "Modern Tech Architecture",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80",
      difficulty: "HARD",
      dynamicDifficulty: 3.5,
      isPublished: true,
      playCount: 9420,
      rating: 4.8,
      timeLimitSec: 15,
      tags: ["AI", "Transformers", "Distributed Systems", "Tech"],
      creatorId: quizMasterPriya.id,
      creatorName: quizMasterPriya.displayName,
      creatorAvatar: quizMasterPriya.avatarUrl,
      questions: techQuizQuestions,
    };

    const gkQuizQuestions: QuestionRecord[] = [
      {
        id: "q_gk_1",
        type: "MULTIPLE_CHOICE",
        questionText: "Which space agency achieved the historic soft landing near the Lunar South Pole in August 2023 with Chandrayaan-3?",
        explanation: "ISRO (Indian Space Research Organisation) successfully landed the Vikram lander near the Moon's South Pole on August 23, 2023.",
        options: [
          { id: "A", text: "NASA" },
          { id: "B", text: "ISRO" },
          { id: "C", text: "ESA" },
          { id: "D", text: "JAXA" },
        ],
        correctAnswers: ["B"],
        difficulty: "EASY",
        basePoints: 100,
        timeLimitSec: 15,
        category: "General Knowledge",
        totalAttempts: 3200,
        correctAttempts: 3050,
        actualSuccessRate: 0.95,
        systemDifficulty: "EASY",
      },
      {
        id: "q_gk_2",
        type: "MULTIPLE_CHOICE",
        questionText: "Which strait connects the Black Sea to the Sea of Marmara and separates European and Asian Istanbul?",
        explanation: "The Bosphorus Strait is the strategic waterway connecting the Black Sea with the Sea of Marmara.",
        options: [
          { id: "A", text: "Strait of Gibraltar" },
          { id: "B", text: "Bosphorus Strait" },
          { id: "C", text: "Dardanelles" },
          { id: "D", text: "Strait of Malacca" },
        ],
        correctAnswers: ["B"],
        difficulty: "MEDIUM",
        basePoints: 100,
        timeLimitSec: 15,
        category: "General Knowledge",
        totalAttempts: 1840,
        correctAttempts: 1210,
        actualSuccessRate: 0.65,
        systemDifficulty: "MEDIUM",
      },
    ];

    const gkQuiz: QuizRecord = {
      id: "quiz_gk_general",
      title: "Global Geopolitics & World Trivia",
      description: "Fast-paced quiz on modern history, international geography, and major milestones.",
      category: "General Knowledge",
      coverImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&auto=format&fit=crop&q=80",
      difficulty: "MEDIUM",
      dynamicDifficulty: 2.2,
      isPublished: true,
      playCount: 15200,
      rating: 4.7,
      timeLimitSec: 15,
      tags: ["Geography", "Space", "Trivia", "Current Affairs"],
      creatorId: quizMasterRahul.id,
      creatorName: quizMasterRahul.displayName,
      creatorAvatar: quizMasterRahul.avatarUrl,
      questions: gkQuizQuestions,
    };

    this.quizzes.set(econQuiz.id, econQuiz);
    this.quizzes.set(techQuiz.id, techQuiz);
    this.quizzes.set(gkQuiz.id, gkQuiz);

    // 3. Seed Tournaments (PRD Section 36)
    const dailyCup: TournamentRecord = {
      id: "tourn_daily_cup",
      title: "QuizVerse Daily Arena Cup #142",
      description: "Speed-scoring tournament across Economics, Science, and Geopolitics with coin multipliers.",
      type: "DAILY",
      status: "REGISTRATION",
      category: "General Knowledge & Tech",
      entryFeeCoins: 50,
      prizePoolCoins: 5000,
      maxParticipants: 128,
      registeredCount: 84,
      currentRound: 1,
      totalRounds: 4,
      startTime: new Date(Date.now() + 3600 * 1000 * 2).toISOString(),
    };

    const collegeChampionship: TournamentRecord = {
      id: "tourn_inter_college",
      title: "All-India Inter-College Knowledge Clash",
      description: "Prestigious institutional battle featuring teams from IITs, IIMs, DU, and BITS.",
      type: "COLLEGE",
      status: "UPCOMING",
      category: "Competitive Exams",
      entryFeeCoins: 100,
      prizePoolCoins: 25000,
      maxParticipants: 256,
      registeredCount: 198,
      currentRound: 1,
      totalRounds: 5,
      startTime: new Date(Date.now() + 86400 * 1000 * 2).toISOString(),
    };

    this.tournaments.set(dailyCup.id, dailyCup);
    this.tournaments.set(collegeChampionship.id, collegeChampionship);

    // 4. Seed Notifications (PRD Section 55)
    this.notifications.set(defaultUser.id, [
      {
        id: "notif_1",
        userId: defaultUser.id,
        title: "Friend Challenge from Rahul",
        body: "Rahul challenged you in Monetary Policy: 'Can you beat 1,840 pts?'",
        type: "CHALLENGE",
        actionUrl: "/ring?mode=FRIEND_BATTLE&challengeId=chal_1",
        isRead: false,
        createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
      },
      {
        id: "notif_2",
        userId: defaultUser.id,
        title: "21-Day Streak at Risk! 🔥",
        body: "Play a quick battle or complete today's learning lesson before midnight to protect your streak.",
        type: "STREAK_RISK",
        actionUrl: "/ring",
        isRead: false,
        createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      },
      {
        id: "notif_3",
        userId: defaultUser.id,
        title: "Rank Surge +4 Positions 🏆",
        body: "Your rating moved to 1,680 MMR! You are in the Top 3% of Economics competitors.",
        type: "RANK_CHANGE",
        actionUrl: "/leaderboard",
        isRead: true,
        createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
      },
    ]);
  }

  // Ring Matchmaking Engine (Section 10 of PRD)
  public createOrJoinMatch(params: {
    userId: string;
    mode: "QUICK_MATCH" | "ONE_VS_ONE" | "MULTIPLAYER" | "FRIEND_BATTLE";
    category?: string;
  }): MatchRecord {
    const user = this.users.get(params.userId) || this.users.get("usr_demo_1")!;
    const category = params.category || "Economics";

    // Select quiz matching category
    let matchedQuiz = Array.from(this.quizzes.values()).find((q) => q.category === category);
    if (!matchedQuiz) {
      matchedQuiz = Array.from(this.quizzes.values())[0];
    }

    // Check for an open WAITING match in the same mode and category
    for (const match of this.matches.values()) {
      if (
        match.status === "WAITING" &&
        match.mode === params.mode &&
        match.category === matchedQuiz.category &&
        match.participants.length < match.maxPlayers &&
        !match.participants.some((p) => p.userId === user.id)
      ) {
        match.participants.push({
          userId: user.id,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          rating: user.rating,
          currentScore: 0,
          currentRank: match.participants.length + 1,
          currentStreak: 0,
          highestStreak: 0,
          speedBonusTotal: 0,
          streakBonusTotal: 0,
          correctCount: 0,
          answersSubmitted: {},
        });

        if (match.participants.length >= match.maxPlayers) {
          match.status = "IN_PROGRESS";
        }
        return match;
      }
    }

    // Generate new short match code
    const code = "RNG" + Math.floor(1000 + Math.random() * 9000);
    const matchId = "match_" + Date.now();

    const maxPlayers = params.mode === "ONE_VS_ONE" ? 2 : params.mode === "MULTIPLAYER" ? 4 : 2;

    const newMatch: MatchRecord = {
      id: matchId,
      code,
      mode: params.mode,
      status: "IN_PROGRESS", // ready to play immediately for instant responsiveness
      category: matchedQuiz.category,
      quizId: matchedQuiz.id,
      maxPlayers,
      currentQuestionIndex: 0,
      totalQuestions: matchedQuiz.questions.length,
      roundTimeLimitSec: matchedQuiz.timeLimitSec,
      questions: matchedQuiz.questions,
      createdAt: new Date().toISOString(),
      participants: [
        {
          userId: user.id,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          rating: user.rating,
          currentScore: 0,
          currentRank: 1,
          currentStreak: 0,
          highestStreak: 0,
          speedBonusTotal: 0,
          streakBonusTotal: 0,
          correctCount: 0,
          answersSubmitted: {},
        },
        // Auto-match an intelligent competitive bot if 1v1 or Quick Match for lively gameplay
        {
          userId: "bot_rohan",
          username: "Rohan_Pro",
          displayName: "Rohan Verma",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          rating: Math.max(1000, user.rating + Math.floor(Math.random() * 80 - 40)),
          currentScore: 0,
          currentRank: 2,
          currentStreak: 0,
          highestStreak: 0,
          speedBonusTotal: 0,
          streakBonusTotal: 0,
          correctCount: 0,
          isBot: true,
          answersSubmitted: {},
        },
      ],
    };

    this.matches.set(code, newMatch);
    this.matches.set(matchId, newMatch);
    return newMatch;
  }

  // Answer validation and scoring (Section 14 & 15 of PRD)
  public submitAnswer(params: {
    matchCode: string;
    userId: string;
    questionIndex: number;
    selectedAnswer: string[];
    timeTakenSec: number;
  }) {
    const match = this.matches.get(params.matchCode);
    if (!match) throw new Error("Match not found");

    const question = match.questions[params.questionIndex];
    if (!question) throw new Error("Question index out of bounds");

    const participant = match.participants.find((p) => p.userId === params.userId);
    if (!participant) throw new Error("Participant not in match");

    // Validate answer
    const isCorrect =
      question.correctAnswers.length === params.selectedAnswer.length &&
      question.correctAnswers.every((ans) => params.selectedAnswer.includes(ans));

    // Calculate score using authoritative scoring engine
    const scoreResult = calculateQuestionScore({
      isCorrect,
      timeTakenSec: params.timeTakenSec,
      difficulty: question.difficulty,
      currentStreak: participant.currentStreak,
    });

    participant.currentScore += scoreResult.totalScore;
    participant.speedBonusTotal += scoreResult.speedBonus;
    participant.streakBonusTotal += scoreResult.streakBonus;
    participant.currentStreak = scoreResult.newStreak;
    if (participant.currentStreak > participant.highestStreak) {
      participant.highestStreak = participant.currentStreak;
    }
    if (isCorrect) {
      participant.correctCount++;
    }

    participant.answersSubmitted[params.questionIndex] = {
      selectedAnswer: params.selectedAnswer,
      isCorrect,
      timeTakenSec: params.timeTakenSec,
      points: scoreResult.totalScore,
    };

    // Simulate competitor/bot answer to make multiplayer live rankings active
    const bot = match.participants.find((p) => p.isBot);
    if (bot && !bot.answersSubmitted[params.questionIndex]) {
      const botCorrect = Math.random() > 0.3; // 70% accuracy
      const botTime = Number((2.5 + Math.random() * 4).toFixed(1));
      const botScore = calculateQuestionScore({
        isCorrect: botCorrect,
        timeTakenSec: botTime,
        difficulty: question.difficulty,
        currentStreak: bot.currentStreak,
      });

      bot.currentScore += botScore.totalScore;
      bot.speedBonusTotal += botScore.speedBonus;
      bot.streakBonusTotal += botScore.streakBonus;
      bot.currentStreak = botScore.newStreak;
      if (bot.currentStreak > bot.highestStreak) bot.highestStreak = bot.currentStreak;
      if (botCorrect) bot.correctCount++;
      bot.answersSubmitted[params.questionIndex] = {
        selectedAnswer: botCorrect ? question.correctAnswers : ["Z"],
        isCorrect: botCorrect,
        timeTakenSec: botTime,
        points: botScore.totalScore,
      };
    }

    // Section 16: Live Leaderboard update after every question
    match.participants.sort((a, b) => b.currentScore - a.currentScore);
    match.participants.forEach((p, index) => {
      p.currentRank = index + 1;
    });

    // Advance question index
    const isLastQuestion = params.questionIndex >= match.totalQuestions - 1;
    if (isLastQuestion) {
      match.status = "COMPLETED";
      match.endedAt = new Date().toISOString();
      this.finalizeMatch(match);
    } else {
      match.currentQuestionIndex = params.questionIndex + 1;
    }

    return {
      isCorrect,
      correctAnswers: question.correctAnswers,
      explanation: question.explanation,
      scoreResult,
      updatedParticipant: participant,
      liveRankings: match.participants.map((p) => ({
        userId: p.userId,
        displayName: p.displayName,
        avatarUrl: p.avatarUrl,
        currentScore: p.currentScore,
        currentRank: p.currentRank,
        currentStreak: p.currentStreak,
      })),
      nextQuestionIndex: match.currentQuestionIndex,
      isMatchCompleted: match.status === "COMPLETED",
    };
  }

  // Section 18: Match Completion Calculation
  private finalizeMatch(match: MatchRecord) {
    match.participants.sort((a, b) => b.currentScore - a.currentScore);

    match.participants.forEach((p, idx) => {
      const finalRank = idx + 1;
      p.finalPosition = finalRank;

      // Base XP + Score bonus
      const xpWon = 150 + Math.round(p.currentScore * 0.25) + (finalRank === 1 ? 250 : 50);
      const coinsWon = finalRank === 1 ? 50 : finalRank === 2 ? 25 : 10;

      // Rating delta
      const avgOpponentRating = match.participants
        .filter((other) => other.userId !== p.userId)
        .reduce((acc, curr) => acc + curr.rating, 0) / Math.max(1, match.participants.length - 1);

      const ratingDelta = calculateRatingDelta(p.rating, avgOpponentRating, finalRank, match.participants.length);

      p.xpEarned = xpWon;
      p.coinsEarned = coinsWon;
      p.ratingDelta = ratingDelta;

      // Update real user records
      const user = this.users.get(p.userId);
      if (user && !p.isBot) {
        user.xp += xpWon;
        user.coins += coinsWon;
        user.rating = Math.max(100, user.rating + ratingDelta);
        user.matchesPlayed++;
        if (finalRank === 1) user.matchesWon++;
        user.totalQuestionsAnswered += match.totalQuestions;
        if (p.highestStreak > user.bestAnswerStreak) {
          user.bestAnswerStreak = p.highestStreak;
        }

        // Recalculate level
        const levelData = getLevelFromXP(user.xp);
        user.level = levelData.level;

        // Recalculate archetype
        user.archetype = determinePlayerArchetype({
          averageResponseTimeSec: 3.8,
          accuracy: user.accuracy,
          categoriesPlayed: { [match.category]: { total: user.matchesPlayed, correct: Math.round(user.matchesPlayed * 0.8) } },
          comebackWins: 4,
          matchesPlayed: user.matchesPlayed,
        }).archetype;
      }
    });
  }

  // Section 22: Journey Structured Learning System
  public getJourneySubjects(): JourneySubject[] {
    return [
      {
        id: "subj_econ",
        title: "Economics & Finance",
        icon: "📈",
        description: "Master Demand & Supply, Market Structures, National Income, and Monetary Policy.",
        progressPercent: 68,
        topics: [
          {
            id: "top_macro",
            title: "Macroeconomics Core",
            description: "Aggregate demand, fiscal balance, and GDP accounts.",
            lessons: [
              { id: "les_demand_supply", title: "Demand & Supply Elasticity", completed: true, mastery: 95, weakAreas: [] },
              { id: "les_market_structures", title: "Market Structures & Oligopoly", completed: true, mastery: 88, weakAreas: [] },
              { id: "les_national_income", title: "National Income Accounting", completed: true, mastery: 82, weakAreas: ["GNP Deflator"] },
            ],
          },
          {
            id: "top_banking",
            title: "Money & Banking",
            description: "Central bank tools, inflation control, and liquidity traps.",
            lessons: [
              { id: "les_money_banking", title: "Money & Banking Foundations", completed: true, mastery: 85, weakAreas: [] },
              { id: "les_monetary_policy", title: "Monetary Policy & Repo Mechanics", completed: false, mastery: 60, weakAreas: ["Open Market Operations"] },
              { id: "les_fiscal_policy", title: "Fiscal Policy & Deficit Financing", completed: false, mastery: 30, weakAreas: ["Primary Deficit"] },
            ],
          },
        ],
      },
      {
        id: "subj_comp_exams",
        title: "Competitive Exam Preparation",
        icon: "🏛️",
        description: "High-yield practice for UPSC CSE, SSC CGL, Banking, and State PSCs.",
        progressPercent: 42,
        topics: [
          {
            id: "top_polity",
            title: "Indian Polity & Constitution",
            description: "Fundamental Rights, Directive Principles, and Judicial Review.",
            lessons: [
              { id: "les_preamble", title: "Preamble & Fundamental Rights", completed: true, mastery: 90, weakAreas: [] },
              { id: "les_parliament", title: "Parliamentary Procedures & Bills", completed: false, mastery: 45, weakAreas: ["Money Bills vs Financial Bills"] },
            ],
          },
        ],
      },
      {
        id: "subj_science",
        title: "Science & Technology",
        icon: "⚛️",
        description: "Physics, Artificial Intelligence, Space Exploration, and Biotechnology.",
        progressPercent: 55,
        topics: [
          {
            id: "top_quantum_ai",
            title: "AI & Quantum Frontiers",
            description: "Modern machine learning, neural architectures, and quantum computing.",
            lessons: [
              { id: "les_neural_nets", title: "Neural Networks & Backpropagation", completed: true, mastery: 85, weakAreas: [] },
              { id: "les_transformers", title: "Transformer Self-Attention", completed: false, mastery: 50, weakAreas: ["Positional Encoding"] },
            ],
          },
        ],
      },
    ];
  }

  // Section 47: Multiple Leaderboard Types
  public getLeaderboards(type: "GLOBAL" | "COMPETITIVE" | "XP" | "STREAK" | "CREATORS") {
    const allUsers = Array.from(this.users.values()).filter((u, i, arr) => arr.findIndex(x => x.id === u.id) === i);

    switch (type) {
      case "COMPETITIVE":
        return allUsers
          .slice()
          .sort((a, b) => b.rating - a.rating)
          .map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            username: u.username,
            displayName: u.displayName,
            avatarUrl: u.avatarUrl,
            value: `${u.rating} MMR`,
            badge: u.rating > 2000 ? "Grandmaster" : u.rating > 1600 ? "Master" : "Diamond",
            archetype: u.archetype,
          }));

      case "XP":
        return allUsers
          .slice()
          .sort((a, b) => b.xp - a.xp)
          .map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            username: u.username,
            displayName: u.displayName,
            avatarUrl: u.avatarUrl,
            value: `${u.xp.toLocaleString()} XP`,
            badge: `Lvl ${u.level}`,
            archetype: u.archetype,
          }));

      case "STREAK":
        return allUsers
          .slice()
          .sort((a, b) => b.streak - a.streak)
          .map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            username: u.username,
            displayName: u.displayName,
            avatarUrl: u.avatarUrl,
            value: `${u.streak} Days 🔥`,
            badge: `${u.bestAnswerStreak} Max Streak`,
            archetype: u.archetype,
          }));

      case "CREATORS":
        return allUsers
          .filter((u) => u.role === "QUIZ_MASTER")
          .sort((a, b) => (b.creatorFollowersCount || 0) - (a.creatorFollowersCount || 0))
          .map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            username: u.username,
            displayName: u.displayName,
            avatarUrl: u.avatarUrl,
            value: `${(u.creatorFollowersCount || 0).toLocaleString()} Followers`,
            badge: `⭐ ${u.creatorRating?.toFixed(1) || "5.0"}`,
            archetype: u.archetype,
          }));

      case "GLOBAL":
      default:
        return allUsers
          .slice()
          .sort((a, b) => b.rating + b.xp * 0.01 - (a.rating + a.xp * 0.01))
          .map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            username: u.username,
            displayName: u.displayName,
            avatarUrl: u.avatarUrl,
            value: `${u.rating} MMR (${u.xp.toLocaleString()} XP)`,
            badge: `Lvl ${u.level}`,
            archetype: u.archetype,
          }));
    }
  }
}

// Global singleton instance for hot-reloading Next.js in dev and edge execution
declare global {
  // eslint-disable-next-line no-var
  var quizVerseStore: QuizVerseStore | undefined;
}

export const store = global.quizVerseStore || new QuizVerseStore();

if (process.env.NODE_ENV !== "production") {
  global.quizVerseStore = store;
}

export default store;
