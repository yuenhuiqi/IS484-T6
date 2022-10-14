from haystack.nodes import FARMReader
from config import settings

reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=settings.use_gpu)