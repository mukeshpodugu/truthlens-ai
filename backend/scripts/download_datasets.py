import os
import csv
import random
import pandas as pd

# Directory mappings
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
SUB_DIRS = ["raw", "processed", "validation", "test", "models", "checkpoints", "experiments", "logs"]

def initialize_directories():
    print("Initializing dataset folder structure...")
    for folder in SUB_DIRS:
        path = os.path.join(DATASETS_DIR, folder)
        os.makedirs(path, exist_ok=True)
        print(f"  Created: {path}")

# Mock News Content Banks
REAL_SUBJECTS = ["politics", "technology", "sports", "health", "finance", "worldnews"]
FAKE_SUBJECTS = ["politics", "left-news", "US_News", "Middle-East"]

REAL_TITLES = [
    "Senate Passes Landmark Infrastructure Bill with Bipartisan Support",
    "Apple Unveils M4 Pro Chips with Next-Generation AI Engines",
    "WHO Approves New Malaria Vaccine for Distribution in Africa",
    "Federal Reserve Keeps Interest Rates Steady Amid Cooling Inflation",
    "Lionel Messi Leads Inter Miami to Historical League Victory",
    "Global Summit Agrees on New Carbon Emission Reduction Targets",
    "NASA's Artemis III Mission Announces Astronaut Crew for Moon Landing",
    "Microsoft Announces Partnership to Enhance Cyber Defense Infrastructure",
    "Retail Sales Rise Unexpectedly in May Indicating Strong Economy",
    "Japan Launches Next-Generation Satellite to Track Climate Change Impacts"
]

REAL_BODY_TEMPLATES = [
    "In a major legislative victory, the Senate has passed a sweeping infrastructure bill yesterday. The legislation, which was approved with a 68-32 bipartisan vote, earmarks billions of dollars for highway improvements, clean water initiatives, and high-speed broadband expansion. 'This is a historic investment in our nation's future,' the President remarked during a press conference.",
    "Apple Inc. announced its latest silicon chips today during a keynote event at Cupertino. The new M4 Pro architecture features dedicated hardware accelerators for large language models. Experts note this move places Apple at the forefront of local machine-learning computation on personal computers. Shipments are expected to begin early next month.",
    "The World Health Organization has officially cleared a breakthrough malaria vaccine for pediatric use. After successful Phase III clinical trials involving over ten thousand children, the vaccine proved to be 78% effective at preventing severe infections. Health ministers across sub-Saharan Africa welcomed the announcement.",
    "Federal Reserve Chairman Jerome Powell announced that the central bank will maintain its benchmark interest rate at current levels. Citing stable job growth and CPI numbers indicating cooling inflation, Powell advised that rate cuts remain on the table later this year depending on incoming economic data.",
    "In an electric performance, Lionel Messi scored twice and assisted a third goal to lead Inter Miami to victory. The match, which drew a record crowd of seventy thousand fans, marks the club's first major trophy since the restructuring of its tactical staff last winter."
]

FAKE_TITLES = [
    "SHOCK REPORT: Secret Labs Found Processing Alien DNA in Underground Facilities",
    "PROOF: Government Uses Weather Satellites to Control Local Election Results",
    "NASA Confirms Giant Asteroid Will Wipe Out Earth Next Tuesday (NASA Tries to Hide It!)",
    "Doctors Warn: Eating Broccoli Could Turn Your Immune System Against You",
    "Secret Deal: Tech Giant CEO to Buy Small European Country to Host Private Servers",
    "BREAKING: Area 51 Opens Gates to Public Following Unprecedented Hack",
    "Scientists Reveal: Water on Mars Actually Tastes Like Lemon Juice",
    "ALERT: Major Banks to Wipe Out All Customer Balances by Midnight",
    "Newly Discovered Document Proves Shakespeare Was Actually a Time Traveler",
    "Leaked Audio: Famous Actor Admits to Being a Hologram Controlled by AI"
]

FAKE_BODY_TEMPLATES = [
    "A leaked intelligence document reveals a massive operation involving underground facilities. According to anonymous sources within the department, scientists have successfully integrated foreign genetic material into local crop cycles. Critics claim the media is keeping quiet to avoid global panic, but whistleblowers suggest the experiment has been running since 1998.",
    "A shocking new report circulating on social media claims that recent shifts in storm patterns were fully artificial. Analysts claim that weather-altering lasers mounted on communication arrays were activated during the primary elections. While official spokesmen denied the claims, local online activists say they have raw frequency logs.",
    "Astronomers at a private observatory have sounded the alarm on an incoming celestial body. Despite official space agency statements claiming the object will pass harmlessly, independent experts suggest a total direct impact is inevitable by next Tuesday. Stock up on supplies immediately before markets close.",
    "A controversial study published on a wellness blog claims that popular green vegetables contain hidden chemicals designed to disrupt human cells. The author advises readers to swap fresh green vegetables for synthetic nutrient pills manufactured by his company. State regulators have filed a warning against these claims.",
    "In a shocking development, leaked emails suggest a tech billionaire is currently negotiating the purchase of sovereign land in the Mediterranean. The reports claim he plans to establish a private zone free from data privacy regulations. Officials have not commented on the authenticity of the emails."
]

def generate_fake_real_news_dataset():
    print("Generating Fake vs Real News Dataset...")
    true_path = os.path.join(DATASETS_DIR, "raw", "True.csv")
    fake_path = os.path.join(DATASETS_DIR, "raw", "Fake.csv")
    
    # Generate True news
    with open(true_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["title", "text", "subject", "date"])
        for i in range(150):
            title = random.choice(REAL_TITLES) + f" (Ref: {i+1000})"
            text = random.choice(REAL_BODY_TEMPLATES) + " This official report was verified by local bureaus."
            subject = random.choice(REAL_SUBJECTS)
            date = f"June {random.randint(1, 28)}, 2024"
            writer.writerow([title, text, subject, date])
            
    # Generate Fake news
    with open(fake_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["title", "text", "subject", "date"])
        for i in range(150):
            title = random.choice(FAKE_TITLES) + f" !!! (MUST SEE: {i+1000})"
            text = random.choice(FAKE_BODY_TEMPLATES) + " Share this now before it gets taken down by the mainstream media!"
            subject = random.choice(FAKE_SUBJECTS)
            date = f"June {random.randint(1, 28)}, 2024"
            writer.writerow([title, text, subject, date])
            
    print(f"  True.csv created with {150} rows.")
    print(f"  Fake.csv created with {150} rows.")

def generate_liar_dataset():
    print("Generating LIAR Credibility Dataset...")
    liar_path = os.path.join(DATASETS_DIR, "raw", "liar.csv")
    classes = ["True", "Mostly True", "Half True", "Barely True", "False", "Pants on Fire"]
    
    with open(liar_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["statement", "label", "subject", "speaker", "job_title", "state_info", "party_affiliation"])
        
        for i in range(300):
            label = random.choice(classes)
            if label in ["True", "Mostly True", "Half True"]:
                statement = random.choice(REAL_TITLES) + f" - verified claim {i}"
                party = random.choice(["democrat", "republican"])
            else:
                statement = random.choice(FAKE_TITLES) + f" - unverified claim {i}"
                party = "independent"
                
            subject = random.choice(REAL_SUBJECTS)
            speaker = f"politician_{random.randint(1, 20)}"
            job = "Senator" if party != "independent" else "Blogger"
            state = random.choice(["Texas", "California", "New York", "Florida"])
            
            writer.writerow([statement, label, subject, speaker, job, state, party])
            
    print(f"  liar.csv created with 300 rows.")

def generate_kaggle_dataset():
    print("Generating Kaggle Fake News Dataset...")
    kaggle_path = os.path.join(DATASETS_DIR, "raw", "kaggle_fake_news.csv")
    
    with open(kaggle_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["id", "title", "author", "text", "label"])
        
        for i in range(300):
            label = random.choice([0, 1])  # 0 for Real, 1 for Fake
            title = random.choice(REAL_TITLES if label == 0 else FAKE_TITLES) + f" - ID {i}"
            author = f"Reporter {random.randint(1, 30)}" if label == 0 else "Anonymous Source"
            text = random.choice(REAL_BODY_TEMPLATES if label == 0 else FAKE_BODY_TEMPLATES)
            writer.writerow([i, title, author, text, label])
            
    print(f"  kaggle_fake_news.csv created with 300 rows.")

if __name__ == "__main__":
    initialize_directories()
    generate_fake_real_news_dataset()
    generate_liar_dataset()
    generate_kaggle_dataset()
    print("All datasets generated successfully in raw directory!")
