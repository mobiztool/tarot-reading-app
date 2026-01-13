#!/bin/bash
# Download Tarot card images from renanbotasse/tarot repo

BASE_URL="https://raw.githubusercontent.com/renanbotasse/tarot/main/deck"
CARDS_DIR="/Users/sutthikitphunthanasap/Documents/CursorCode/TestProject/apps/web/public/cards"

echo "📥 Downloading Tarot card images..."

# Major Arcana (0-21) → major/00.jpg to major/21.jpg
MAJOR_CARDS=(
  "00_Fool.jpg"
  "01_Magician.jpg"
  "02_High_Priestess.jpg"
  "03_Empress.jpg"
  "04_Emperor.jpg"
  "05_Hierophant.jpg"
  "06_Lovers.jpg"
  "07_Chariot.jpg"
  "08_Strength.jpg"
  "09_Hermit.jpg"
  "10_Wheel_of_Fortune.jpg"
  "11_Justice.jpg"
  "12_Hanged_Man.jpg"
  "13_Death.jpg"
  "14_Temperance.jpg"
  "15_Devil.jpg"
  "16_Tower.jpg"
  "17_Star.jpg"
  "18_Moon.jpg"
  "19_Sun.jpg"
  "20_Judgement.jpg"
  "21_World.jpg"
)

echo "🃏 Downloading Major Arcana..."
for i in "${!MAJOR_CARDS[@]}"; do
  num=$(printf "%02d" $i)
  curl -sL "${BASE_URL}/${MAJOR_CARDS[$i]}" -o "${CARDS_DIR}/major/${num}.jpg"
  echo "  ✓ Major ${num}"
done

# Wands (22-35 in source) → wands/01.jpg to wands/14.jpg
WANDS=(
  "22_Ace_of_Wands.jpg"
  "23_Two_of_Wands.jpg"
  "24_Three_of_Wands.jpg"
  "25_Four_of_Wands.jpg"
  "26_Five_of_Wands.jpg"
  "27_Six_of_Wands.jpg"
  "28_Seven_of_Wands.jpg"
  "29_Eight_of_Wands.jpg"
  "30_Nine_of_Wands.jpg"
  "31_Ten_of_Wands.jpg"
  "32_Page_of_Wands.jpg"
  "33_Knight_of_Wands.jpg"
  "34_Queen_of_Wands.jpg"
  "35_King_of_Wands.jpg"
)

echo "🔥 Downloading Wands..."
for i in "${!WANDS[@]}"; do
  num=$(printf "%02d" $((i+1)))
  curl -sL "${BASE_URL}/${WANDS[$i]}" -o "${CARDS_DIR}/wands/${num}.jpg"
  echo "  ✓ Wands ${num}"
done

# Pentacles (36-49 in source) → pentacles/01.jpg to pentacles/14.jpg
PENTACLES=(
  "36_Ace_of_Pentacles.jpg"
  "37_Two_of_Pentacles.jpg"
  "38_Three_of_Pentacles.jpg"
  "39_Four_of_Pentacles.jpg"
  "40_Five_of_Pentacles.jpg"
  "41_Six_of_Pentacles.jpg"
  "42_Seven_of_Pentacles.jpg"
  "43_Eight_of_Pentacles.jpg"
  "44_Nine_of_Pentacles.jpg"
  "45_Ten_of_Pentacles.jpg"
  "46_Page_of_Pentacles.jpg"
  "47_Knight_of_Pentacles.jpg"
  "48_Queen_of_Pentacles.jpg"
  "49_King_of_Pentacles.jpg"
)

echo "⭐ Downloading Pentacles..."
for i in "${!PENTACLES[@]}"; do
  num=$(printf "%02d" $((i+1)))
  curl -sL "${BASE_URL}/${PENTACLES[$i]}" -o "${CARDS_DIR}/pentacles/${num}.jpg"
  echo "  ✓ Pentacles ${num}"
done

# Cups (50-63 in source) → cups/01.jpg to cups/14.jpg
CUPS=(
  "50_Ace_of_Cups.jpg"
  "51_Two_of_Cups.jpg"
  "52_Three_of_Cups.jpg"
  "53_Four_of_Cups.jpg"
  "54_Five_of_Cups.jpg"
  "55_Six_of_Cups.jpg"
  "56_Seven_of_Cups.jpg"
  "57_Eight_of_Cups.jpg"
  "58_Nine_of_Cups.jpg"
  "59_Ten_of_Cups.jpg"
  "60_Page_of_Cups.jpg"
  "61_Knight_of_Cups.jpg"
  "62_Queen_of_Cups.jpg"
  "63_King_of_Cups.jpg"
)

echo "💧 Downloading Cups..."
for i in "${!CUPS[@]}"; do
  num=$(printf "%02d" $((i+1)))
  curl -sL "${BASE_URL}/${CUPS[$i]}" -o "${CARDS_DIR}/cups/${num}.jpg"
  echo "  ✓ Cups ${num}"
done

# Swords (64-77 in source) → swords/01.jpg to swords/14.jpg
SWORDS=(
  "64_Ace_of_Swords.jpg"
  "65_Two_of_Swords.jpg"
  "66_Three_of_Swords.jpg"
  "67_Four_of_Swords.jpg"
  "68_Five_of_Swords.jpg"
  "69_Six_of_Swords.jpg"
  "70_Seven_of_Swords.jpg"
  "71_Eight_of_Swords.jpg"
  "72_Nine_of_Swords.jpg"
  "73_Ten_of_Swords.jpg"
  "74_Page_of_Swords.jpg"
  "75_Knight_of_Swords.jpg"
  "76_Queen_of_Swords.jpg"
  "77_King_of_Swords.jpg"
)

echo "⚔️ Downloading Swords..."
for i in "${!SWORDS[@]}"; do
  num=$(printf "%02d" $((i+1)))
  curl -sL "${BASE_URL}/${SWORDS[$i]}" -o "${CARDS_DIR}/swords/${num}.jpg"
  echo "  ✓ Swords ${num}"
done

echo ""
echo "✅ Download complete! Total: 78 cards"
echo ""
ls -la ${CARDS_DIR}/major/ | head -5
ls -la ${CARDS_DIR}/wands/ | head -5


