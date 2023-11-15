import {
  subscribe,
  unsubscribe,
} from '../../App/components/supabaseUpdateSubscriber';

export type CurrentlyGeneratingStoriesObserver = (
  currentlyGeneratingStories: string[],
) => void;

export enum StoryGenerationStatus {
  Success,
  Failure,
  ContentWarning,
}

export type StoryGenerationResult = {
  story: any;
  status: StoryGenerationStatus;
}

export type StoryGenerationResultObserver = (
  storyGenerationResult: StoryGenerationResult,
) => void;

export let currentlyGeneratingStoriesSubjectSingleton: CurrentlyGeneratingStoriesSubject =
  null;

export class CurrentlyGeneratingStoriesSubject {
  private observers: CurrentlyGeneratingStoriesObserver[] = [];
  private storyGenObservers: StoryGenerationResultObserver[] = [];
  private latestCurrentlyGeneratingStories: string[] = [];
  public user = null;
  public storageUrl = null;

  public constructor() {
    // prevent another instance from being created
    if (currentlyGeneratingStoriesSubjectSingleton) {
      return currentlyGeneratingStoriesSubjectSingleton;
    }

    subscribe('stories-db-changes', '*', (payload) => {
      if (payload.eventType === 'UPDATE') {
        this.updateIfStoryGenerated(payload.new);
      }
      const currentlyGeneratingStories = this.fetchCurrentlyGeneratingStories(
        this.user.id,
      );
      this.notify(currentlyGeneratingStories);
    });
  }

  public triggerInitialFetch() {
    if (!this.user) {
      return;
    }

    const currentlyGeneratingStories = this.fetchCurrentlyGeneratingStories(
      this.user.id,
    );
    this.notify(currentlyGeneratingStories);
  }

  public subscribe(observer: CurrentlyGeneratingStoriesObserver) {
    this.observers.push(observer);
  }

  public storyGenSubscribe(observer: StoryGenerationResultObserver) {
    this.storyGenObservers.push(observer);
  }

  public getLatestData() {
    return this.latestCurrentlyGeneratingStories;
  }

  public unsubscribe(observer: CurrentlyGeneratingStoriesObserver) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public storyGenUnsubscribe(observer: StoryGenerationResultObserver) {
    this.storyGenObservers = this.storyGenObservers.filter((obs) => obs !== observer);
  }

  private updateIfStoryGenerated(story){
    if (!story.isdonegenerating) {
      return;
    }
    if (!this.latestCurrentlyGeneratingStories.some((curr) => curr.storyid === story.storyid)) {
      return;
    }
    // So a story has been generated
    if (story.contentflagged) {
      this.storyGenNotify({
        story: story,
        status: StoryGenerationStatus.ContentWarning,
      });
      return;
    } else if (story.generationfailed) {
      this.storyGenNotify({
        story: story,
        status: StoryGenerationStatus.Failure,
      });
    } else {
      this.storyGenNotify({
        story: story,
        status: StoryGenerationStatus.Success,
      });
    }
  }

  private async fetchCurrentlyGeneratingStories(user_id) {
    const response = await fetch(
      `${this.storageUrl}/${user_id}/currently-generating-stories/`,
    ).then((res) => res.json());
    this.updateLatestData(response);
    return response;
  }

  private async updateLatestData(data: Promise<any>) {
    this.latestCurrentlyGeneratingStories = await data;
  }

  private async notify(currentlyGeneratingStories: Promise<any>) {
    const stories = await currentlyGeneratingStories;
    this.observers.forEach((observer) => observer(stories));
  }

  private async storyGenNotify(storyGenerationResult: StoryGenerationResult) {
    this.storyGenObservers.forEach((observer) =>
      observer(storyGenerationResult),
    );
  }
}

currentlyGeneratingStoriesSubjectSingleton =
  new CurrentlyGeneratingStoriesSubject();
