from haystack import Document

from cupid_ai.model import Doc
import regex as re
from wordsegment import load, segment

import nltk

words = set(nltk.corpus.words.words())


class InProgressDoc(Doc):
  '''
  Class to contain all preprocessing methods and build the processed doc object later on
  '''
  def __init__(self, doc_uuid, page_no, raw_text, lines):
    Doc.__init__(self, doc_uuid, page_no, raw_text)
    self.lines = lines
  
  def build(self):
    processed_text = " ".join(self.lines)
    meta = {
        "doc_uuid": self.doc_uuid,
        "page": self.page_no,
        "raw": re.sub(r"\s+", " ", self.raw_text)
      }

    return Document(
      content=processed_text,
      meta=meta
      )

  def remove_page_numbers(self):
    for (j, line) in enumerate(self.lines):
      if re.match(r"\s*(page)?\s*" + str(j+1) + r"\s*$", line):
        self.lines.pop(j)
    return self

  def remove_non_alpha(self):
    for (i, line) in enumerate(self.lines):
      removed_non_alpha = re.sub(r"[^a-zA-Z\s]", "", line)
      removed_orphan_chars = re.sub(r"(?i)\b[b-hj-z]\b", " ", removed_non_alpha)
      self.lines[i] = removed_orphan_chars.strip()
    return self
  
  def join_sentences(self):
    if len(self.lines) > 0:
      newlines = [self.lines[0]]
      for line in self.lines[1:]:
        if len(line) > 0 and (line.strip()[0].islower() or line.strip().split()[0].isupper()):
          newlines[-1] += " " + line
        else:
          newlines.append(line)
      self.lines = newlines
    return self
  
  # current use of wordsegment gives mixed results. Good separation in some cases but also combines terms it's not supposed to combine ("the RM -> therm"),
  # or splits terms that are not meant to be split ("CAGIDs" -> "cagi ds")
  # need some experimentation with a custom corpus 
  def segment_words(self):
    load()
    if len(self.lines) > 0:
      # print("---BEFORE--- \n", self.lines)
      newlines = []
      for line in self.lines:
        newlines.append(" ".join(segment(line)))
      # print("---AFTER---\n", newlines)
      self.lines = newlines
    return self
  
  def remove_non_en(self):
    for (i, line) in enumerate(self.lines):
      self.lines[i] = " ".join(w for w in nltk.wordpunct_tokenize(line) if w.lower() in words)
    return self 

      
      