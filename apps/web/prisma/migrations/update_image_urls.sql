-- Update image_url for all cards to use new path format
-- Major Arcana: /cards/major/00.jpg to /cards/major/21.jpg
UPDATE cards SET image_url = '/cards/major/' || LPAD(number::text, 2, '0') || '.jpg'
WHERE suit = 'major_arcana';

-- Wands: /cards/wands/01.jpg to /cards/wands/14.jpg
UPDATE cards SET image_url = '/cards/wands/' || LPAD(number::text, 2, '0') || '.jpg'
WHERE suit = 'wands';

-- Cups: /cards/cups/01.jpg to /cards/cups/14.jpg
UPDATE cards SET image_url = '/cards/cups/' || LPAD(number::text, 2, '0') || '.jpg'
WHERE suit = 'cups';

-- Swords: /cards/swords/01.jpg to /cards/swords/14.jpg
UPDATE cards SET image_url = '/cards/swords/' || LPAD(number::text, 2, '0') || '.jpg'
WHERE suit = 'swords';

-- Pentacles: /cards/pentacles/01.jpg to /cards/pentacles/14.jpg
UPDATE cards SET image_url = '/cards/pentacles/' || LPAD(number::text, 2, '0') || '.jpg'
WHERE suit = 'pentacles';


