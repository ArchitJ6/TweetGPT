from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal, Annotated
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel
import operator
from config import *

class EvaluationOutput(BaseModel):
    evaluation: Literal['approved', 'needs_improvement']
    feedback: str

# Define a structured model for evaluation output
# This allows us to use structured outputs in the workflow
structured_eval_model = llm_evaluate.with_structured_output(EvaluationOutput)

class GenerationState(TypedDict):
    topic: str
    tweet: str
    evaluation: Literal['approved', 'needs_improvement']
    feedback: str
    iteration: int
    max_iteration: int
    tweet_history: Annotated[list[str], operator.add]
    feedback_history: Annotated[list[str], operator.add]

# Define the drafting step
# This function generates a tweet based on the provided topic
def draft_tweet(state: GenerationState):
    messages = [
        SystemMessage(content="You are a witty, sharp content creator on X/Twitter."),
        HumanMessage(content=f"""
Generate a humorous and snappy tweet based on the theme: \"{state['topic']}\".

Guidelines:
- Avoid Q&A formats
- Keep it under 280 characters
- Use irony, memes, or relatable humor
- Make it version {state['iteration'] + 1}
""")
    ]
    output = llm_generate.invoke(messages).content
    return {'tweet': output, 'tweet_history': [output]}

# Define the evaluation step
# This function assesses the tweet based on predefined criteria
def assess_tweet(state: GenerationState):
    messages = [
        SystemMessage(content="Act as a brutally honest viral content reviewer."),
        HumanMessage(content=f"""
Evaluate this tweet:
"{state['tweet']}"

Consider:
- Creativity and originality
- Humor level
- Catchiness and shareability
- Brevity and rule adherence

Auto-reject if:
- It’s Q&A or setup-punchline style
- Too long and over 280 characters
- Ends weakly

Give back:
- evaluation: 'approved' or 'needs_improvement'
- feedback: Clear, concise commentary
""")
    ]
    result = structured_eval_model.invoke(messages)
    return {
        'evaluation': result.evaluation,
        'feedback': result.feedback,
        'feedback_history': [result.feedback]
    }

# Define the refinement step
# This function revises the tweet based on feedback
def refine_tweet(state: GenerationState):
    messages = [
        SystemMessage(content="You revise tweets to boost engagement and comedic value."),
        HumanMessage(content=f"""
Based on the feedback: \"{state['feedback']}\"
and original tweet: \"{state['tweet']}\"

Rework a viral tweet under 280 characters, avoiding Q&A format.
""")
    ]
    improved = llm_refine.invoke(messages).content
    return {
        'tweet': improved,
        'iteration': state['iteration'] + 1,
        'tweet_history': [improved]
    }

# Define the evaluation path
# This function determines the next step based on the evaluation result
def evaluate_path(state: GenerationState):
    if state['evaluation'] == 'approved' or state['iteration'] >= state['max_iteration']:
        return 'approved'
    return 'needs_improvement'

# Define the main workflow function
# This function orchestrates the entire tweet generation process
def run_workflow(topic: str, max_iteration: int = 5):
    if not topic:
        raise ValueError("Topic must be provided for tweet generation.")
    if max_iteration <= 0:
        raise ValueError("Max iteration must be greater than 0.")
    
    # Initialize the state with the topic and iteration settings
    # The state is used to track the progress of the workflow
    initial_state = {
        'topic': topic,
        'iteration': 0,
        'max_iteration': max_iteration
    }

    # Define the state graph for the workflow
    # This graph defines the flow of the tweet generation process
    graph = StateGraph(GenerationState)

    # Add nodes and edges to the graph
    graph.add_node('generate', draft_tweet)
    graph.add_node('review', assess_tweet)
    graph.add_node('revise', refine_tweet)
    graph.add_edge(START, 'generate')
    graph.add_edge('generate', 'review')
    graph.add_conditional_edges('review', evaluate_path, {
        'approved': END,
        'needs_improvement': 'revise'
    })
    graph.add_edge('revise', 'review')

    # Compile the graph into a callable workflow
    # This allows the workflow to be executed with the initial state
    flow = graph.compile()

    # Invoke the workflow with the initial state
    # This starts the tweet generation process
    return flow.invoke(initial_state)